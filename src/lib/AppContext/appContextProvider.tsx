"use client";

import { useCallback, useEffect, useState } from "react";
import { Chain, Hex, toHex, Transport } from "viem";
import { BundlerClient } from "viem/account-abstraction";
import { erc20ABI } from "../ABIs/erc20ABI";
import { getKeyByP256 } from "../getKeyData";
import { usePublicClient } from "../hooks/usePublicClient";
import { getSessionKeyFromStorage } from "../indexDB";
import { OpenfortSmartAccount } from "../toOpenfortAccount";
import { KeyPair } from "../types";
import { AppContext, defaultContext } from "./appContext";

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const publicClient = usePublicClient();
  const [smartAccountClient, setSmartAccountClient] = useState<BundlerClient<Transport, Chain, OpenfortSmartAccount> | null>(null);

  const [passkeyCredentialId, setPasskeyCredentialId] = useState<string | null>(null);

  const [balance, setBalance] = useState<number | null>(null);

  const [sessionKey, setSessionKey] = useState<KeyPair | null>(null);

  // Function to fetch balances
  const updateBalance = useCallback(async () => {
    if (!smartAccountClient?.account?.address) return;

    try {
      const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_ERC20_ADDRESS as Hex;
      // Fetch token balance and metadata
      // Get token balance
      const balance = await publicClient.readContract({
        address: TOKEN_ADDRESS as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [smartAccountClient.account.address]
      });

      // Get token decimals
      const decimals = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: erc20ABI,
        functionName: 'decimals',
      });

      setBalance(Number(balance) / 10 ** Number(decimals));

    } catch (error) {
      console.error("Error fetching balances:", error);
      setBalance(null);
    }
  }, [smartAccountClient, publicClient]);

  const [sessionKeyActionsLeft, setSessionKeyActionsLeft] = useState<number | null>(null);
  const updateSessionKeyActionsLeft = useCallback(async ({ x, y }: { x?: Hex, y?: Hex } = {}) => {
    try {
      console.log("updateSessionKeyActionsLeft", { x, y });

      if (!smartAccountClient || !smartAccountClient.account) throw new Error("No smartAccountClient or account to get session key actions left")

      if (!x || !y) {
        if (!sessionKey) throw new Error("No session key to get actions left");
        const coordinates = {
          x: toHex(sessionKey.publicKey.x, { size: 32 }),
          y: toHex(sessionKey.publicKey.y, { size: 32 }),
        } as const;
        x = coordinates.x;
        y = coordinates.y;
      }

      const result = await getKeyByP256(
        { x, y },
        smartAccountClient.account.address,
      )
      console.log("updateSessionKeyActionsLeft result", result, x, y);

      setSessionKeyActionsLeft(Number(result.limit))
    } catch (error) {
      console.error("Error getting session key actions left:", error);
      setSessionKeyActionsLeft(null);
    }
  }, [smartAccountClient, sessionKey]);


  useEffect(() => {
    const get = async () => {
      if (!smartAccountClient || !smartAccountClient.account) return
      const keyInStorage = await getSessionKeyFromStorage(smartAccountClient.account.address)
      if (keyInStorage) {
        const coordinates = {
          x: toHex(keyInStorage.publicKey.x, { size: 32 }),
          y: toHex(keyInStorage.publicKey.y, { size: 32 }),
        } as const;

        setSessionKey(keyInStorage);
        updateSessionKeyActionsLeft(coordinates);
      }
    }

    get()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartAccountClient])


  return (
    <AppContext.Provider value={{
      chain: defaultContext.chain,
      publicClient: defaultContext.publicClient,

      smartAccountClient,
      setSmartAccountClient,

      passkeyCredentialId,
      setPasskeyCredentialId,
      balance,
      updateBalance,
      sessionKey,
      setSessionKey,

      sessionKeyActionsLeft,
      updateSessionKeyActionsLeft,
    }}>
      {children}
    </AppContext.Provider>
  )
}