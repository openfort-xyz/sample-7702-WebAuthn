import { Chain, Hex, PublicClient, Transport } from "viem";
import { OpenfortSmartAccount } from "../toOpenfortAccount";
import { KeyPair } from "../types";
import { BundlerClient } from "viem/account-abstraction";

export type AppContextType = {
  chain: Chain;
  publicClient: PublicClient | null;

  smartAccountClient: BundlerClient<Transport, Chain, OpenfortSmartAccount> | null;
  setSmartAccountClient: (smartAccountClient: BundlerClient<Transport, Chain, OpenfortSmartAccount> | null) => void;

  passkeyCredentialId: string | null;
  setPasskeyCredentialId: (credentialId: string | null) => void;

  balance: number | null;
  updateBalance: () => void;

  sessionKey: KeyPair | null;
  setSessionKey: (key: KeyPair | null) => void;

  sessionKeyActionsLeft: number | null;
  updateSessionKeyActionsLeft: (props?: { x?: Hex, y?: Hex }) => void;
};
