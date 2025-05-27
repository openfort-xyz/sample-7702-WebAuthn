import { createContext } from "react";
import { AppContextType } from "./appContextType";
import { getAppChain } from "../utils";
import { createPublicClient, http } from "viem";

export const defaultContext: AppContextType = {
  chain: getAppChain(),
  publicClient: createPublicClient({
    chain: getAppChain(),
    transport: http(),
  }),

  smartAccountClient: null,
  setSmartAccountClient: () => { },

  passkeyCredentialId: null,
  setPasskeyCredentialId: () => { },

  balance: null,
  updateBalance: () => { },

  sessionKey: null,
  setSessionKey: () => { },

  sessionKeyActionsLeft: null,
  updateSessionKeyActionsLeft: () => { },
}

export const AppContext = createContext<AppContextType>(defaultContext);