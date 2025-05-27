import { WebCryptoP256 } from "ox";
import { useCallback, useEffect, useState } from "react";
import { encodeFunctionData, Hex, toHex, zeroAddress } from "viem";
import { entryPoint08Address, UserOperation } from "viem/account-abstraction";
import { accountABI } from "../../lib/ABIs/accountABI";
import { useAppContext } from "../../lib/AppContext/useAppContext";
import { KeyType } from "../../lib/const";
import { deleteSessionKey, storeSessionKey } from "../../lib/indexDB";
import { webAuthnStubSignature } from "../../lib/stubSignatures";
import { deepHexlify } from "../../lib/utils";
import { getAddressFromP256Key } from "../../lib/utilsP256";
import { NumberDisplay } from "./BalanceDisplay";
import { WalletButton } from "./WalletButton";

export const CreateSessionKeyCard = () => {
  const {
    smartAccountClient,
    passkeyCredentialId: credentialId,
    balance: tokenBalance,
    sessionKey,
    setSessionKey,
    updateSessionKeyActionsLeft,
    sessionKeyActionsLeft,
  } = useAppContext()

  const [sessionKeyResult, setSessionKeyResult] = useState<string | null>(null);
  const [sessionKeyLoading, setSessionKeyLoading] = useState(false);
  const [sessionKeyAddress, setSessionKeyAddress] = useState<string | null>(null);

  const handleCreateSessionKey = useCallback(async () => {
    if (!smartAccountClient || !smartAccountClient.account || !credentialId) throw new Error("No smartAccountClient or account create session key")

    setSessionKeyLoading(true);
    setSessionKeyResult(null);


    try {

      const keyPair = await WebCryptoP256.createKeyPair();

      const publicKey = keyPair.publicKey;

      const spendTokenInfo = {
        token: process.env.NEXT_PUBLIC_ERC20_ADDRESS as Hex,
        limit: 1000000000000000000000000n,
      } as const;

      const now = Math.floor(Date.now() / 1000);
      const validUntil = now + 86400 * 60 * 24 * 30;

      const limits = 10;
      const ethLimit = 0n;

      const callData = encodeFunctionData({
        abi: accountABI,
        functionName: 'registerSessionKey',
        args: [
          {
            pubKey: {
              x: toHex(publicKey.x, { size: 32 }),
              y: toHex(publicKey.y, { size: 32 }),
            },
            eoaAddress: zeroAddress,
            keyType: KeyType.P256_NON_EXTRACTABLE,
          },
          validUntil,
          0,          // nonce
          limits,     // limit
          true,       // authorized
          process.env.NEXT_PUBLIC_ERC20_ADDRESS as Hex,
          spendTokenInfo,
          [
            '0xa9059cbb', // transfer(address,uint256)
            '0x40c10f19'  // function mint(address to)
          ],
          ethLimit
        ]
      });

      const userOperation = await smartAccountClient.prepareUserOperation({
        callData,
        signature: webAuthnStubSignature,
      }) as UserOperation;

      const signature = await smartAccountClient.account.signWithWebAuthn({
        userOperation
      })

      userOperation.signature = signature;

      const userOperationHash = await smartAccountClient.request({
        method: "eth_sendUserOperation",
        params: [
          deepHexlify({ ...userOperation }),
          entryPoint08Address,
        ],
      });

      const { receipt } = await smartAccountClient.waitForUserOperationReceipt({
        hash: userOperationHash,
      });

      const result = receipt.transactionHash;

      console.log("result", result);

      if (!result) {
        setSessionKeyResult('Transaction could not be completed');
        setSessionKeyLoading(false);
        return;
      }

      await storeSessionKey(keyPair, smartAccountClient.account.address);
      setSessionKey(keyPair);

      updateSessionKeyActionsLeft({
        x: toHex(publicKey.x, { size: 32 }),
        y: toHex(publicKey.y, { size: 32 }),
      });

    } catch (error) {
      console.error("Error storing session key:", error);
    }
    setSessionKeyLoading(false);

  }, [smartAccountClient, credentialId, setSessionKey, updateSessionKeyActionsLeft]);

  useEffect(() => {
    if (!sessionKey) return;

    const get = async () => {
      setSessionKeyAddress(await getAddressFromP256Key(sessionKey.publicKey));
    }

    get()
  }, [sessionKey])

  return (

    <div className="card bg-base-200 border border-base-300 rounded-lg shadow-sm">
      <div className="card-body">
        <h2 className="card-title flex items-center justify-between border-b border-base-300 pb-2">
          Create a session key
          {
            sessionKey && smartAccountClient?.account?.address && (
              <div className="flex space-x-2">
                <button
                  className="btn bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none text-white btn-sm relative overflow-hidden"
                  onClick={() => {
                    setSessionKey(null);
                    setSessionKeyResult(null);
                    deleteSessionKey(smartAccountClient?.account?.address as Hex);
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-0"></div>
                  <span className="relative z-10">Logout</span>
                </button>
              </div>
            )
          }
        </h2>

        <div className="flex flex-col items-start gap-2 mt-2">
          {sessionKey && smartAccountClient ? (
            <div className="w-full">
              <pre className="bg-base-300 p-4 rounded-lg w-full">
                <span className="font-bold">Address: </span>
                {sessionKeyAddress}
              </pre>
              {smartAccountClient?.account && (
                <div className="mt-4 w-full">
                  <NumberDisplay
                    symbol="OPF7702"
                    title="Balance"
                    number={tokenBalance}
                  />
                  <NumberDisplay
                    title="Actions left"
                    number={sessionKeyActionsLeft}
                  />
                </div>
              )}
            </div>
          ) : (
            <WalletButton
              enabled={!!smartAccountClient}
              onClick={handleCreateSessionKey}
              loading={sessionKeyLoading}
            >
              Create session key
            </WalletButton>
          )}

          {sessionKeyResult && smartAccountClient && (
            <div className="mt-3 p-3 bg-base-300 rounded-md w-full text-sm break-all">
              <div className="font-semibold mb-1">Result:</div>
              {sessionKeyResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}