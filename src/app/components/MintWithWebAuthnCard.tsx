import { deepHexlify } from "../../lib/utils";
import { useCallback, useEffect, useState } from "react";
import { encodeFunctionData, Hex, parseEther } from "viem";
import { entryPoint08Address, UserOperation } from "viem/account-abstraction";
import { erc20ABI } from "../../lib/ABIs/erc20ABI";
import { useAppContext } from "../../lib/AppContext/useAppContext";
import { webAuthnStubSignature } from "../../lib/stubSignatures";
import { NumberDisplay } from "./BalanceDisplay";
import { WalletButton } from "./WalletButton";

export const MintWithWebAuthnCard = () => {
  const {
    smartAccountClient,
    passkeyCredentialId: credentialId,
    balance: tokenBalance,
    updateBalance,
  } = useAppContext()

  const [mintTxHash, setMintTxHash] = useState<string | null>(null);

  const [mintLoading, setMintLoading] = useState(false);

  const handleMintWithWebAuthn = useCallback(async () => {
    try {
      if (!smartAccountClient || !smartAccountClient.account || !credentialId)
        throw new Error("No smartAccountClient or account create session key");

      setMintLoading(true);
      setMintTxHash(null);

      const erc20Address = process.env.NEXT_PUBLIC_ERC20_ADDRESS as Hex;
      if (!erc20Address) throw new Error("ERC20 contract address is required");

      console.log("Minting 10 tokens with WebAuthn...", smartAccountClient, smartAccountClient.account.address);

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

      if (result) setMintTxHash(result);
    }
    catch (error) {
      console.error("Failed to mint token:", error);
      setMintTxHash(`Failed to mint token: ${error instanceof Error ? error.message : String(error)}`);
    }
    finally {
      setMintLoading(false);
      updateBalance();
    }
  }, [smartAccountClient, credentialId, updateBalance]);


  useEffect(() => {
    if (!smartAccountClient)
      setMintTxHash(null);
  }, [smartAccountClient]);

  return (
    <div className="card bg-base-200 border border-base-300 rounded-lg shadow-sm">
      <div className="card-body">
        <h3 className="card-title border-b border-base-300 pb-2">
          Mint tokens
        </h3>
        <div className="flex flex-col items-start gap-2 mt-2">
          <WalletButton
            enabled={!!smartAccountClient}
            onClick={() => handleMintWithWebAuthn()}
            loading={mintLoading}
          >
            Mint 10 tokens
          </WalletButton>

          {smartAccountClient?.account && (
            <div className="mt-2 w-full">
              <NumberDisplay
                title="Balance"
                symbol="OPF7702"
                number={tokenBalance}
              />
            </div>
          )}

          {mintTxHash && smartAccountClient && (
            <div className="mt-3 p-3 bg-base-300 rounded-md w-full text-sm break-all">
              <div className="font-semibold mb-1">Transaction Result:</div>
              <pre className="break-all whitespace-pre-wrap">{mintTxHash}</pre>
              {mintTxHash && mintTxHash.startsWith('0x') && (
                <div className="mt-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_SCANNER_URL}/tx/${mintTxHash}`}
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