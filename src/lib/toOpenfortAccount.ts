import { WebAuthnP256, WebCryptoP256 } from "ox";
import { PublicKey } from "ox/PublicKey";
import {
  type Account,
  type Address,
  type Assign,
  type Chain,
  type Client,
  type Hex,
  type JsonRpcAccount,
  type LocalAccount,
  type OneOf,
  type Transport,
  type WalletClient,
  decodeFunctionData,
  encodeFunctionData,
  toHex
} from "viem";
import {
  type SmartAccount,
  type SmartAccountImplementation,
  UserOperation,
  entryPoint08Abi,
  getUserOperationHash,
  getUserOperationTypedData,
  toSmartAccount
} from "viem/account-abstraction";
import { getChainId, readContract } from "viem/actions";
import { getAction } from "viem/utils";
import { accountABI } from "./ABIs/accountABI";
import { ENTRY_POINT_VERSION, KeyType } from "./const";
import { encodeP256Signature, encodeWebAuthnSignature } from "./encodeSignature";
import { getKeyById } from "./getKeyData";
import { KeyPair } from "./types";

const executeSingleAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "dest",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "func",
        type: "bytes"
      }
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

const executeBatch08Abi = [
  {
    type: "function",
    name: "executeBatch",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct BaseAccount.Call[]",
        components: [
          {
            name: "target",
            type: "address",
            internalType: "address"
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256"
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes"
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  }
] as const

export type SignWithWebAuthnParameters = {
  userOperation: UserOperation,
}

export type SignWithSessionKeyParameters = {
  userOperation: UserOperation,
  sessionKey: KeyPair | Hex
}

export type OpenfortSmartAccountImplementation = Assign<
  SmartAccountImplementation,
  {
    signWithWebAuthn: (parameters: SignWithWebAuthnParameters) => Promise<Hex>,
    signWithSessionKey: (parameters: SignWithSessionKeyParameters) => Promise<Hex>,
    createSessionKey: () => Promise<PublicKey>,
    getSessionKeys: () => Promise<PublicKey[]>,
  }
>;

export type OpenfortSmartAccount = SmartAccount<OpenfortSmartAccountImplementation>;

type ToOpenfortSmartAccountParameters = Assign<{
  client: Client<
    Transport,
    Chain | undefined,
    JsonRpcAccount | LocalAccount | undefined
  >
  owner?: OneOf<
    | WalletClient<Transport, Chain | undefined, Account>
    | Account
  >,
  entryPointAddress: Address
  address?: Address
  nonceKey?: bigint
}, OneOf<{ credential: WebAuthnCredential } | { credentialId: string }>>;

type GetAccountNonceParams = {
  address: Address
  entryPointAddress: Address
  key?: bigint
}

const getAccountNonce = async (
  client: Client,
  args: GetAccountNonceParams
): Promise<bigint> => {
  const { address, entryPointAddress, key = BigInt(0) } = args

  return await getAction(
    client,
    readContract,
    "readContract"
  )({
    address: entryPointAddress,
    abi: [
      {
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "key",
            type: "uint192"
          }
        ],
        name: "getNonce",
        outputs: [
          {
            name: "nonce",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "getNonce",
    args: [address, key]
  })
}

type WebAuthnCredential = {
  id: string,
  x: Hex,
  y: Hex
}

/**
 * @description Creates an Simple Account from a private key.
 * @returns A Private Key Simple Account.
 */
export async function toOpenfortSmartAccount(
  parameters: ToOpenfortSmartAccountParameters
): Promise<OpenfortSmartAccount> {
  const {
    client,
    owner,
    address: accountAddress,
    nonceKey,
    entryPointAddress,
  } = parameters

  const address = accountAddress ?? owner?.address
  if (!address) {
    throw new Error("Account address not found")
  }

  let credential: WebAuthnCredential;

  if (!parameters.credential) {
    const keyId = 0n;
    const pubKey = await getKeyById(keyId, address, KeyType.WEBAUTHN);
    credential = {
      id: parameters.credentialId,
      x: pubKey.x,
      y: pubKey.y,
    }
  } else {
    credential = parameters.credential;
  }

  const entryPoint = {
    address: entryPointAddress,
    abi: entryPoint08Abi,
    version: ENTRY_POINT_VERSION,
  }

  console.log("toOpenfortSmartAccount", owner);


  let chainId: number

  const getMemoizedChainId = async () => {
    if (chainId) return chainId
    chainId = client.chain
      ? client.chain.id
      : await getAction(client, getChainId, "getChainId")({})
    return chainId
  }
  await getMemoizedChainId()

  const getFactoryArgs = async () => {
    return {
      factory: undefined,
      factoryData: undefined
    }
  }

  const signWithWebAuthn = async (parameters: SignWithWebAuthnParameters) => {
    const { userOperation } = parameters

    console.log("signWithWebAuthn", userOperation, address, credential);

    if (!address)
      throw new Error("Owner address or credentialId not found")

    const userOpHash = getUserOperationHash({
      entryPointVersion: ENTRY_POINT_VERSION,
      chainId,
      entryPointAddress,
      userOperation: userOperation as UserOperation,
    });

    const webauthnData = await WebAuthnP256.sign({
      challenge: userOpHash,
      credentialId: credential.id,
      rpId: window.location.hostname,
      userVerification: 'required',
    });
    const pubKey = { x: credential.x, y: credential.y };

    const signature = encodeWebAuthnSignature(webauthnData, pubKey);

    return signature
  }

  const signWithSessionKey = async (parameters: SignWithSessionKeyParameters) => {
    const { userOperation, sessionKey } = parameters
    if (typeof sessionKey === 'string') throw new Error("Session key not found")

    const userOpHash = getUserOperationHash({ entryPointVersion: ENTRY_POINT_VERSION, chainId, entryPointAddress, userOperation });

    const { r, s } = await WebCryptoP256.sign({
      privateKey: sessionKey.privateKey,
      payload: userOpHash,
    })

    const x = toHex(sessionKey.publicKey.x, { size: 32 });
    const y = toHex(sessionKey.publicKey.y, { size: 32 });

    const signature = encodeP256Signature({
      r: toHex(r),
      s: toHex(s),
      x: BigInt(x),
      y: BigInt(y),
    });

    return signature
  }

  const createSessionKey = async () => {
    throw new Error("Not implemented")
  }

  const getSessionKeys = async () => {
    throw new Error("Not implemented")
  }

  const baseSmartAccount = toSmartAccount<OpenfortSmartAccountImplementation>({
    client,
    entryPoint,
    getFactoryArgs,
    async getAddress() {
      return address
    },
    async encodeCalls(calls) {
      console.log("encodeCalls", calls);
      if (calls.length > 1) {
        return encodeFunctionData({
          abi: accountABI,
          functionName: "executeBatch",
          args: [
            Array.from({ length: calls.length }, (_, i) => calls[i].to),
            Array.from({ length: calls.length }, (_, i) => calls[i].value ?? 0n),
            Array.from({ length: calls.length }, (_, i) => calls[i].data ?? "0x"),
          ]
        })

      }

      const call = calls.length === 0 ? undefined : calls[0]

      if (!call) {
        throw new Error("No calls to encode")
      }

      return encodeFunctionData({
        abi: executeSingleAbi,
        functionName: "execute",
        args: [call.to, call.value ?? 0n, call.data ?? "0x"]
      })
    },
    decodeCalls: async (callData) => {
      console.log("decodeCalls", callData);
      try {
        const calls: {
          to: Address
          data: Hex
          value?: bigint
        }[] = []

        const decodedV8 = decodeFunctionData({
          abi: executeBatch08Abi,
          data: callData
        })

        for (const call of decodedV8.args[0]) {
          calls.push({
            to: call.target,
            data: call.data,
            value: call.value
          })
        }

        return calls
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        const decodedSingle = decodeFunctionData({
          abi: executeSingleAbi,
          data: callData
        })

        return [
          {
            to: decodedSingle.args[0],
            value: decodedSingle.args[1],
            data: decodedSingle.args[2]
          }
        ]
      }
    },
    signWithWebAuthn,
    signWithSessionKey,
    createSessionKey,
    getSessionKeys,
    async getNonce(args) {
      return getAccountNonce(client, {
        address: await this.getAddress(),
        entryPointAddress: entryPoint.address,
        key: nonceKey ?? args?.key
      })
    },
    async getStubSignature() {
      // with EOA
      // return "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041fffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c00000000000000000000000000000000000000000000000000000000000000"

      // with webAuthn
      // return "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000010aec5a92cc94bb28f9205591bedcb17286839a14973f1c29a6cd2b1c77b21f4d248f0770faff81e778a8e96b352d7e4fd4d7196ba054a19e33adea15289f2ce9f286c668221cad349bd17a11d9edab7286203fd1c11ca8ed6170eaea395ffb096c311e526c8b85436e9386655fb75ba8028823297db69be18c08b19cde06e151000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22414337464a654371356b6377652d6c7562646f792d66426f6b72653552785743613545546b33425f415838222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a35313733222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000"

      // with P256
      return "0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080c7be6e45531b1a95f1d8d4c9f2b746a27584b5b2ccf37da576fff8afba09c3864e08df5fcb2b36a039dc2dda82d4a0b20295099698ae8d0b121e69554216d63f5e1f67bcbb441c9cfa9fb57841edaa6cb327b7696772f292e16c88d3fcda62814b3aa92311b3f735a7b4f120db00ea15bd2822e686d1035cffef789ff50f97dd"
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signMessage: async (_) => {
      throw new Error("Simple account isn't 1271 compliant")
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signTypedData: async (_) => {
      throw new Error("Simple account isn't 1271 compliant")
    },
    async signUserOperation(parameters) {
      console.log("signUserOperation", parameters);

      if (!owner) {
        throw new Error("Owner not found")
      }

      const { chainId = await getMemoizedChainId(), ...userOperation } = parameters

      const typedData = getUserOperationTypedData({
        chainId,
        entryPointAddress: entryPoint.address,
        userOperation: {
          ...userOperation,
          sender:
            userOperation.sender ?? (await this.getAddress()),
          signature: "0x"
        }
      })
      const localOwner = owner as LocalAccount
      return await localOwner.signTypedData(typedData)

    }
  }) as Promise<OpenfortSmartAccount>

  return baseSmartAccount;
}
