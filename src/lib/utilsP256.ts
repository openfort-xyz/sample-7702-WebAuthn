import { keccak256 } from "ox/Hash";
import { PublicKey } from "ox/PublicKey";
import { encodePacked, toHex } from "viem";

export async function getAddressFromP256Key(publicKey: PublicKey): Promise<string> {

  const keyHash = keccak256(
    encodePacked(['bytes32', 'bytes32'], [
      toHex(publicKey.x, { size: 32 }),
      toHex(publicKey.y, { size: 32 }),
    ]),
  );
  const address = keyHash.slice(-40);

  return `0x${address}`;
}
