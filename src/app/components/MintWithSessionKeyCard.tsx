import { useCallback, useEffect, useState } from "react";
import { encodeFunctionData, Hex, parseEther } from "viem";
import { entryPoint08Address, UserOperation } from "viem/account-abstraction";
import { erc20ABI } from "../../lib/ABIs/erc20ABI";
import { useAppContext } from "../../lib/AppContext/useAppContext";
import { P256StubSignature } from "../../lib/stubSignatures";
import { deepHexlify } from "../../lib/utils";
import { WalletButton } from "./WalletButton";

export const MintWithSessionKeyCard = () => {

  const {
    smartAccountClient,
    updateBalance,
    sessionKey,
    sessionKeyActionsLeft,
    updateSessionKeyActionsLeft,
  } = useAppContext()

  // Loading states
  const [mintWithSessionKeyHash, setMintWithSessionKeyHash] = useState<string | null>(null);
  const [mintWithSessionKeyLoading, setMintWithSessionKeyLoading] = useState(false);

  const handleMintWithSessionKey = useCallback(async () => {
    if (!smartAccountClient || !smartAccountClient.account || !sessionKey) throw new Error("No smartAccountClient or account create session key")

    setMintWithSessionKeyLoading(true);
    setMintWithSessionKeyHash(null);

    try {
      const erc20Address = process.env.NEXT_PUBLIC_ERC20_ADDRESS as Hex;

      const data = encodeFunctionData({
        abi: erc20ABI,
        functionName: 'mint',
        args: [
          smartAccountClient.account.address,
          parseEther("10")
        ]
      });

      const userOperation = await smartAccountClient.prepareUserOperation({
        calls: [{
          to: erc20Address,
          data,
        }],
        signature: P256StubSignature,
      }) as UserOperation;

      const signature = await smartAccountClient.account.signWithSessionKey({
        userOperation,
        sessionKey,
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
      const tx = receipt.transactionHash;

      if (!tx) {
        setMintWithSessionKeyHash(sessionKeyActionsLeft === 0 ? 'No more actions left on this session key' : 'Transaction could not be completed');
        setMintWithSessionKeyLoading(false);
        return;
      }

      updateSessionKeyActionsLeft();
      setMintWithSessionKeyHash(tx);
      setMintWithSessionKeyLoading(false);

    } catch (error) {
      console.error("Error minting with session key:", error);
      if (sessionKeyActionsLeft === 0) {
        setMintWithSessionKeyHash('No more actions left on this session key');
      } else {
        setMintWithSessionKeyHash('Transaction failed: ' + (error instanceof Error ? error.message : String(error)));
      }
    } finally {
      updateBalance();
      setMintWithSessionKeyLoading(false);
    }

  }, [sessionKey, sessionKeyActionsLeft, updateBalance, updateSessionKeyActionsLeft, smartAccountClient]);

  useEffect(() => {
    if (!smartAccountClient || !sessionKey)
      setMintWithSessionKeyHash(null);
  }, [smartAccountClient, sessionKey]);

  return (

    <div className="card bg-base-200 border border-base-300 rounded-lg shadow-sm">
      <div className="card-body">
        <h2 className="card-title border-b border-base-300 pb-2">
          Mint with session key
        </h2>
        <div className="flex flex-col items-start gap-2 mt-2">
          <WalletButton
            enabled={!!sessionKey}
            onClick={handleMintWithSessionKey}
            loading={!!mintWithSessionKeyLoading}
            text="Please create a session key first"
          >
            Mint 10 tokens
          </WalletButton>
          {mintWithSessionKeyHash && smartAccountClient && (
            <div className="mt-3 p-3 bg-base-300 rounded-md w-full text-sm break-all">
              <div className="font-semibold mb-1">Transaction Result:</div>
              <pre className="break-all whitespace-pre-wrap">{mintWithSessionKeyHash}</pre>
              {mintWithSessionKeyHash && mintWithSessionKeyHash.startsWith('0x') && (
                <div className="mt-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_SCANNER_URL}/tx/${mintWithSessionKeyHash}`}
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