import { WebAuthnP256 } from "ox";
import { encodeAbiParameters, Hex, toHex } from "viem";
import { KeyType } from "./const";

export const encodeWebAuthnSignature = (webauthnData: WebAuthnP256.sign.ReturnType, pubKey: { x: Hex, y: Hex }) => {
  return encodeAbiParameters(
    [
      { name: 'keyType', type: 'uint8' },
      { name: 'requireUserVerification', type: 'bool' },
      { name: 'authenticatorData', type: 'bytes' },
      { name: 'clientDataJSON', type: 'string' },
      { name: 'challengeIndex', type: 'uint256' },
      { name: 'typeIndex', type: 'uint256' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
      {
        name: 'pubKey',
        type: 'tuple',
        components: [
          { name: 'x', type: 'uint256' },
          { name: 'y', type: 'uint256' }
        ]
      }
    ],
    [
      KeyType.WEBAUTHN,
      webauthnData.metadata.userVerificationRequired,
      webauthnData.metadata.authenticatorData,
      webauthnData.metadata.clientDataJSON,
      BigInt(webauthnData.metadata.challengeIndex),
      BigInt(webauthnData.metadata.typeIndex),
      toHex(webauthnData.signature.r),
      toHex(webauthnData.signature.s),
      {
        x: BigInt(pubKey.x),
        y: BigInt(pubKey.y)
      }
    ]
  );
}


export const encodeP256Signature = ({
  r,
  s,
  x,
  y,
}: {
  r: Hex,
  s: Hex,
  x: bigint,
  y: bigint,
}) => {
  const inner = encodeAbiParameters(
    [
      { type: 'bytes32', name: 'r' },
      { type: 'bytes32', name: 's' },
      {
        type: 'tuple',
        name: 'pubKey',
        components: [
          { name: 'x', type: 'uint256' },
          { name: 'y', type: 'uint256' },
        ],
      },
    ],
    [
      r,
      s,
      {
        x,
        y,
      },
    ]
  );

  return encodeAbiParameters(
    [
      { name: 'keyType', type: 'uint8' },
      { name: 'inner', type: 'bytes' }, 
    ],
    [KeyType.P256_NON_EXTRACTABLE, inner]
  );
}