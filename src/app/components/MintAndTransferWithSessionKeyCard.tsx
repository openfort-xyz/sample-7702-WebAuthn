import { WebCryptoP256 } from "ox";
import { useCallback, useEffect, useState } from "react";
import { encodeFunctionData, Hex, parseEther, toHex } from "viem";
import { entryPoint08Address, EntryPointVersion, getUserOperationHash, UserOperation } from "viem/account-abstraction";
import { erc20ABI } from "../../lib/ABIs/erc20ABI";
import { useAppContext } from "../../lib/AppContext/useAppContext";
import { ENTRY_POINT_VERSION } from "../../lib/const";
import { encodeP256Signature } from "../../lib/encodeSignature";
import { P256StubSignature } from "../../lib/stubSignatures";
import { deepHexlify } from "../../lib/utils";
import { WalletButton } from "./WalletButton";

export const MintAndTransferWithSessionKeyCard = () => {

  const {
    smartAccountClient,
    updateBalance,
    chain: { id: chainId },
    sessionKey,
    sessionKeyActionsLeft,
    updateSessionKeyActionsLeft,
  } = useAppContext()

  // Loading states
  const [mintAndTransferWithSessionKeyHash, setMintAndTransferWithSessionKeyHash] = useState<string | null>(null);
  const [mintAndTransferWithSessionKeyLoading, setMintAndTransferWithSessionKeyLoading] = useState(false);

  const handleMintAndTransferWithSessionKey = useCallback(async () => {
    if (!smartAccountClient || !smartAccountClient.account || !sessionKey) throw new Error("No smartAccountClient or account create session key")

    setMintAndTransferWithSessionKeyLoading(true);
    setMintAndTransferWithSessionKeyHash(null);

    try {
      const erc20Address = process.env.NEXT_PUBLIC_ERC20_ADDRESS as Hex;

      const calls = [{
        to: erc20Address,
        data: encodeFunctionData({
          abi: erc20ABI,
          functionName: 'mint',
          args: [
            smartAccountClient.account.address,
            parseEther("10")
          ]
        })
      }, {
        to: erc20Address,
        data: encodeFunctionData({
          abi: erc20ABI,
          functionName: 'transfer',
          args: [
            '0xA84E4F9D72cb37A8276090D3FC50895BD8E5Aaf1',
            parseEther("5")
          ]
        })
      }];

      const userOperation = await smartAccountClient.prepareUserOperation({
        calls,
        signature: P256StubSignature,
      });

      const userOpHash = getUserOperationHash<EntryPointVersion>({ entryPointVersion: ENTRY_POINT_VERSION, chainId, entryPointAddress: entryPoint08Address, userOperation: userOperation as UserOperation });

      const { r, s } = await WebCryptoP256.sign({
        privateKey: sessionKey.privateKey,
        payload: userOpHash,
      })

      const publicKey = sessionKey.publicKey

      const x = toHex(publicKey.x, { size: 32 });
      const y = toHex(publicKey.y, { size: 32 });

      if (!smartAccountClient.account) throw new Error("No smartAccountClient account")

      const signature = encodeP256Signature({
        r: toHex(r),
        s: toHex(s),
        x: BigInt(x),
        y: BigInt(y),
      });

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
      const tx = receipt.transactionHash;

      if (!tx) {
        setMintAndTransferWithSessionKeyHash(sessionKeyActionsLeft === 0 ? 'No more actions left on this session key' : 'Transaction could not be completed');
        setMintAndTransferWithSessionKeyLoading(false);
        return;
      }

      updateSessionKeyActionsLeft();
      setMintAndTransferWithSessionKeyHash(tx);
      setMintAndTransferWithSessionKeyLoading(false);

    } catch (error) {
      console.error("Error minting and transfering with session key:", error);
      if (sessionKeyActionsLeft === 0) {
        setMintAndTransferWithSessionKeyHash('No more actions left on this session key');
      } else {
        setMintAndTransferWithSessionKeyHash('Transaction failed: ' + (error instanceof Error ? error.message : String(error)));
      }
    } finally {
      updateBalance();
      setMintAndTransferWithSessionKeyLoading(false);
    }

  }, [chainId, sessionKey, sessionKeyActionsLeft, updateBalance, updateSessionKeyActionsLeft, smartAccountClient]);

  useEffect(() => {
    if (!smartAccountClient || !sessionKey)
      setMintAndTransferWithSessionKeyHash(null);
  }, [smartAccountClient, sessionKey]);

  return (

    <div className="card bg-base-200 border border-base-300 rounded-lg shadow-sm">
      <div className="card-body">
        <h2 className="card-title border-b border-base-300 pb-2">
          Mint and transfer with session key
        </h2>
        <div className="flex flex-col items-start gap-2 mt-2">
          <WalletButton
            enabled={!!sessionKey}
            onClick={handleMintAndTransferWithSessionKey}
            loading={!!mintAndTransferWithSessionKeyLoading}
            text="Please create a session key first"
          >
            Mint 10 tokens and transfer 5 tokens
          </WalletButton>

          {mintAndTransferWithSessionKeyHash && smartAccountClient && (
            <div className="mt-3 p-3 bg-base-300 rounded-md w-full text-sm break-all">
              <div className="font-semibold mb-1">Transaction Result:</div>
              <pre className="break-all whitespace-pre-wrap">{mintAndTransferWithSessionKeyHash}</pre>
              {mintAndTransferWithSessionKeyHash && mintAndTransferWithSessionKeyHash.startsWith('0x') && (
                <div className="mt-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_SCANNER_URL}/tx/${mintAndTransferWithSessionKeyHash}`}
                    data-tip={process.env.NEXT_PUBLIC_SCANNER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tooltip text-blue-500 hover:underline"
                  >
                    View →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}