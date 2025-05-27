import cookie from "cookiejs";
import { Bytes, WebAuthnP256 } from "ox";
import { useCallback, useState } from "react";
import { createClient, encodeAbiParameters, encodeFunctionData, Hex, http, toHex } from "viem";
import { createBundlerClient, entryPoint08Address, UserOperation } from "viem/account-abstraction";
import { generatePrivateKey, privateKeyToAccount, signAuthorization } from "viem/accounts";
import { prepareAuthorization } from "viem/actions";
import { accountABI } from "../../lib/ABIs/accountABI";
import { useAppContext } from "../../lib/AppContext/useAppContext";
import { COOKIE_SELECTED_CREDENTIAL_ID, COOKIE_SELECTED_WALLET } from "../../lib/const";
import { getWebAuthnMK } from "../../lib/getKeyData";
import { usePaymasterClient } from "../../lib/hooks/usePaymasterClient";
import { usePublicClient } from "../../lib/hooks/usePublicClient";
import { getHashAndSig } from "../../lib/signHash";
import { toOpenfortSmartAccount } from "../../lib/toOpenfortAccount";
import { deepHexlify } from "../../lib/utils";
import { NumberDisplay } from "./BalanceDisplay";

export const YourWalletCard = () => {
  const publicClient = usePublicClient();
  const { paymasterClient, paymasterUrl, getGasPrice } = usePaymasterClient();

  const {
    smartAccountClient,
    setSmartAccountClient,
    setPasskeyCredentialId,
    setSessionKey,
    balance: tokenBalance,
    chain,
  } = useAppContext()

  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  const [importWalletLoading, setImportWalletLoading] = useState(false);

  const handleLogOut = useCallback(() => {
    cookie.remove(COOKIE_SELECTED_WALLET);
    cookie.remove(COOKIE_SELECTED_CREDENTIAL_ID);

    setSmartAccountClient(null);
    setPasskeyCredentialId(null);
    setSessionKey(null);
  }, [setPasskeyCredentialId, setSmartAccountClient, setSessionKey]);

  const handleCreateWallet = useCallback(async () => {
    setCreateWalletLoading(true);
    try {
      const privateKey = generatePrivateKey();
      const signer = privateKeyToAccount(privateKey);

      const credential = await WebAuthnP256.createCredential({
        authenticatorSelection: {
          requireResidentKey: false,
          residentKey: 'preferred',
          userVerification: 'required',
        },
        createFn: undefined,
        rp: undefined,
        user: {
          id: Bytes.from(signer.address),
          name: `${signer.address.slice(0, 6)}...${signer.address.slice(-4)}`,
        },
      })

      const account = await toOpenfortSmartAccount({
        owner: signer,
        client: publicClient,
        entryPointAddress: entryPoint08Address,
        credential: {
          id: credential.raw.id,
          x: toHex(credential.publicKey.x, { size: 32 }),
          y: toHex(credential.publicKey.y, { size: 32 }),
        }
      });

      const smartAccountClient = createBundlerClient({
        account,
        chain,
        transport: http(paymasterUrl),
        paymaster: paymasterClient,
        userOperation: {
          estimateFeesPerGas: async () => {
            return (await getGasPrice()).fast;
          },
        },
      });

      const { x, y } = credential.publicKey;

      const client = createClient({
        chain,
        pollingInterval: 1_000,
        transport: http()
      })
      const authorization = await prepareAuthorization(client, {
        account: signer.address,
        contractAddress: process.env.NEXT_PUBLIC_IMPLEMENTATION_CONTRACT as Hex,
      })
      const signedAuthorization = await signAuthorization({
        ...authorization,
        privateKey,
      });

      const nonce = await account.getNonce()

      const keyData = await getWebAuthnMK(toHex(x), toHex(y));

      const { messageHash, signatureInit } = await getHashAndSig(signer);

      console.log("messageHash", messageHash);
      console.log("signatureInit", signatureInit);
      const callData = encodeFunctionData({
        abi: accountABI,
        functionName: 'initialize',
        args: [keyData.webAuthnKey, keyData.spendTokenInfo, keyData.selectors, messageHash, signatureInit, keyData.validUntil, nonce + 1n]
      });

      console.log("Preparing user operation...");

      let userOperation = await smartAccountClient.prepareUserOperation({ callData, authorization: signedAuthorization }) as UserOperation;
      console.log("User operation prepared:", userOperation);

      const userOpSig = await account.signUserOperation(userOperation as UserOperation);

      const wrappedSig = encodeAbiParameters(
        [
          { type: 'uint8' },
          { type: 'bytes' },
        ],
        [0, userOpSig],
      );
      console.log("userOpSig", wrappedSig)
      userOperation = { ...userOperation, signature: wrappedSig };
      if ('authorization' in userOperation) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { authorization, ...rest } = userOperation;
        userOperation = rest as UserOperation;
      }
      const userOperationHash = await smartAccountClient.request({
        method: "eth_sendUserOperation",
        params: [
          deepHexlify({ ...userOperation, eip7702Auth: signedAuthorization }),
          entryPoint08Address,
        ],
      });
      console.log("User operation hash:", userOperationHash);

      const { receipt } = await smartAccountClient.waitForUserOperationReceipt({
        hash: userOperationHash,
      });

      if (!receipt) throw new Error("Failed to initialize account");

      setSmartAccountClient(smartAccountClient);
      setPasskeyCredentialId(credential.raw.id);
      cookie.set(COOKIE_SELECTED_WALLET, account.address);
      cookie.set(COOKIE_SELECTED_CREDENTIAL_ID, credential.raw.id);

      console.log('🎉 Account initialized successfully!');
    }
    catch (error) {
      console.error('Error creating wallet:', error);
    }
    finally {
      setCreateWalletLoading(false);
    }
  }, [chain, getGasPrice, paymasterClient, paymasterUrl, publicClient, setPasskeyCredentialId, setSmartAccountClient]);

  const handleImportWallet = useCallback(async () => {

    setImportWalletLoading(true);
    try {
      const credential = await WebAuthnP256.sign({
        challenge: "0x",
        rpId: window.location.hostname,
      });

      const response = credential.raw
        .response as AuthenticatorAssertionResponse

      const address = Bytes.toHex(new Uint8Array(response.userHandle!))

      setPasskeyCredentialId(credential.raw.id);
      cookie.set(COOKIE_SELECTED_CREDENTIAL_ID, credential.raw.id);

      const account = await toOpenfortSmartAccount({
        address: address,
        client: publicClient,
        entryPointAddress: entryPoint08Address,
        credentialId: credential.raw.id,
      })

      const smartAccountClient = createBundlerClient({
        account,
        chain,
        transport: http(paymasterUrl),
        paymaster: paymasterClient,
        userOperation: {
          estimateFeesPerGas: async () => {
            return (await getGasPrice()).fast;
          },
        },
      });

      setSmartAccountClient(smartAccountClient);
      cookie.set(COOKIE_SELECTED_WALLET, address);

      console.log("Credential", credential, JSON.parse(credential.metadata.clientDataJSON), address);
    } catch (error) {
      console.error('Error importing wallet:', error);
    } finally {
      setImportWalletLoading(false);
    }
  }, [chain, getGasPrice, paymasterClient, paymasterUrl, publicClient, setPasskeyCredentialId, setSmartAccountClient]);


  return (

    <div className="card bg-base-200 border border-base-300 rounded-lg">
      <div className="card-body">
        <h2 className="card-title flex items-center justify-between border-b border-base-300 pb-2">
          Your wallet
          {
            smartAccountClient?.account && (
              <div className="flex space-x-2">
                <button
                  className={`btn bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none text-white btn-sm relative overflow-hidden ${createWalletLoading || importWalletLoading ? 'grayscale' : ''}`}
                  onClick={handleLogOut}
                  disabled={createWalletLoading || importWalletLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-0"></div>
                  <span className="relative z-10">Logout</span>
                </button>
              </div>
            )
          }
        </h2>
        {smartAccountClient?.account ? (
          <div>
            <pre className="bg-base-300 p-4 rounded-lg mt-2">
              <span className="font-bold">Address: </span>
              {smartAccountClient.account.address}
            </pre>
            <div className="flex flex-col gap-1 mt-3">
              <NumberDisplay
                number={0}
                symbol="ETH"
                title="Native balance"
              />
              <NumberDisplay
                number={tokenBalance}
                symbol="OPF7702"
                title="Balance"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 mt-2">
            <button
              className={`btn bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none text-white relative overflow-hidden ${createWalletLoading ? 'grayscale' : ''}`}
              onClick={handleCreateWallet}
              disabled={createWalletLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-0"></div>
              <span className="relative z-10 flex items-center gap-2">
                {createWalletLoading && <span className="loading loading-spinner loading-sm text-white"></span>}
                Register
              </span>
            </button>
            <button
              className={`btn bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none text-white relative overflow-hidden ${importWalletLoading ? 'grayscale' : ''}`}
              onClick={handleImportWallet}
              disabled={importWalletLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-0"></div>
              <span className="relative z-10 flex items-center gap-2">
                {importWalletLoading && <span className="loading loading-spinner loading-sm text-white"></span>}
                Sign in
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}