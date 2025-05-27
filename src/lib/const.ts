import { EntryPointVersion } from "viem/account-abstraction";

export const ENTRY_POINT_VERSION: EntryPointVersion = "0.8";

export const COOKIE_SELECTED_WALLET = 'opf.selectedWallet';
export const COOKIE_SELECTED_CREDENTIAL_ID = 'opf.selectedCredentialId';

export enum KeyType {
  EOA = 0,
  WEBAUTHN = 1,
  P256 = 2,
  P256_NON_EXTRACTABLE = 3,
}
