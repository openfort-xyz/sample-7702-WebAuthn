import { createPublicClient, http, PublicClient } from "viem";
import { getAppChain } from "./utils";

export const getPublicClient = (): PublicClient => {
  const chain = getAppChain();

  return createPublicClient({
    chain,
    transport: http(),
  }) as PublicClient;
};