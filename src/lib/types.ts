import { PublicKey } from "ox/PublicKey";

export type KeyPair = {
  privateKey: CryptoKey;
  publicKey: PublicKey;
}
