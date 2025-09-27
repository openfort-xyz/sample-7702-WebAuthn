import { Chain, toHex } from 'viem';
import { baseSepolia, mainnet, polygon, sepolia } from "viem/chains";

export function chainIdToChain(chainId: string): Chain {
  switch (chainId) {
    case "1":
      return mainnet;
    case "11155111":
      return sepolia;
    case "137":
      return polygon;
    case "84532":
      return baseSepolia;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

export function getAppChainId() {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!chainId) {
    throw new Error("Chain ID is not defined");
  }
  return parseInt(chainId, 10);
}

export function getAppChain() {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!chainId) {
    throw new Error("Chain ID is not defined");
  }

  return chainIdToChain(chainId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepHexlify(obj: any): any {
  if (typeof obj === "function") {
    return undefined
  }
  if (obj == null || typeof obj === "string" || typeof obj === "boolean") {
    return obj
  }

  if (typeof obj === "bigint") {
    return toHex(obj)
  }

  if (obj._isBigNumber != null || typeof obj !== "object") {
    return toHex(obj).replace(/^0x0/, "0x")
  }
  if (Array.isArray(obj)) {
    return obj.map((member) => deepHexlify(member))
  }
  return Object.keys(obj).reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (set: any, key: string) => {
      set[key] = deepHexlify(obj[key])
      return set
    },
    {}
  )
}
