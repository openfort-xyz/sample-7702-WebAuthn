
import { createPublicClient, encodePacked, Hex, http, keccak256, zeroAddress } from "viem";
import { accountABI } from "./ABIs/accountABI";
import { KeyType } from "./const";
import { getPublicClient } from "./getPublicClient";
import { getAppChain } from "./utils";

export async function getWebAuthnMK(x: Hex, y: Hex) {
  const webAuthnKey = {
    pubKey: {
      x,
      y,
    },
    eoaAddress: zeroAddress,        // address(0)
    keyType: KeyType.WEBAUTHN,
  } as const;

  const spendTokenInfo = {
    token: zeroAddress,             // address(0)
    limit: 0n,
  } as const;

  const selectors = [
    '0xa9059cbb', // transfer(address,uint256)
    '0x6a627842' // function mint(address to)
  ] as const satisfies readonly Hex[];

  const now = Math.floor(Date.now() / 1000);
  const validUntil = BigInt(now + 6000 * 60 * 24 * 30);

  return { webAuthnKey, spendTokenInfo, selectors, validUntil }
}

export async function getKeyById(id: bigint, ownerAddress: Hex, keyType: KeyType) {
  const publicClient = getPublicClient();

  console.log("getKeyById", id, await publicClient.getChainId(), ownerAddress);
  const { pubKey } = await publicClient.readContract({
    address: ownerAddress,
    abi: accountABI,
    functionName: 'getKeyById',
    args: [id, keyType]
  });
  console.log("pubKey", pubKey);

  return pubKey;
}

const abi2 = {
  "inputs": [
    {
      "internalType": "address",
      "name": "_key",
      "type": "address"
    }
  ],
  "name": "getSessionKeyData",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    },
    {
      "internalType": "uint48",
      "name": "",
      "type": "uint48"
    },
    {
      "internalType": "uint48",
      "name": "",
      "type": "uint48"
    },
    {
      "internalType": "uint48",
      "name": "",
      "type": "uint48"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}

export async function getKeyByEOA(EOAaddress: Hex, address: Hex) {
  console.log("getKeyByEOA", EOAaddress, address);

  const publicClient = createPublicClient({
    chain: getAppChain(),
    transport: http(),
  });

  const value = await publicClient.readContract({
    address: address,
    abi: [abi2],
    functionName: 'getSessionKeyData',
    args: [EOAaddress]
  }) as [boolean, bigint, bigint, bigint];
  if (!value) {
    throw new Error('getKeyByEOA failed');
  }

  console.log("GetKeyByEOA result", value);
  return {
    isActive: value[0],
    validUntil: value[1],
    validAfter: value[2],
    limit: value[3]
  };
}

export async function getKeyByP256(publicKey: { x: Hex, y: Hex }, address: Hex) {
  const publicClient = createPublicClient({
    chain: getAppChain(),
    transport: http(),
  });

  const keyHash = keccak256(
    encodePacked(['bytes32', 'bytes32'], [publicKey.x as Hex, publicKey.y as Hex,]),
  );

  const value = await publicClient.readContract({
    address: address,
    abi: accountABI,
    functionName: 'getSessionKeyData',
    args: [keyHash]
  });

  if (!value) {
    throw new Error('getSessionKeyData failed');
  }

  console.log("getSessionKeyData result", value);
  return {
    isActive: value[0],
    validUntil: value[1],
    validAfter: value[2],
    limit: value[3]
  };
}
