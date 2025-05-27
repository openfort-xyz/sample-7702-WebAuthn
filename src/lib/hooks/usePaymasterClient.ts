import { useMemo } from "react";
import { http } from "viem";
import { createPaymasterClient } from "viem/account-abstraction";
import { getAppChainId } from "../utils";

export type GetUserOperationGasPriceReturnType = {
  slow: {
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
  }
  standard: {
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
  }
  fast: {
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
  }
}

export const usePaymasterClient = () => {
  return useMemo(() => {
    const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
    if (!apiKey) throw new Error("Pimlico API key is required");

    const paymasterUrl = `https://api.pimlico.io/v2/${getAppChainId()}/rpc?apikey=${apiKey}`;

    const paymasterClient = createPaymasterClient({
      transport: http(paymasterUrl),
    })

    const getGasPrice = async () => {
      console.log("Fetching gas price from Pimlico...");

      const response = await fetch(paymasterUrl, {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "pimlico_getUserOperationGasPrice",
          params: []
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching gas price`);
      }

      const data = await response.json();
      console.log("Gas price data:", data);
      return data.result as GetUserOperationGasPriceReturnType;
    }

    return {
      paymasterClient,
      paymasterUrl,
      getGasPrice,
    };
  }, [])
}