export const accountABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_entryPoint",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ECDSAInvalidSignature",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "ECDSAInvalidSignatureLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "ECDSAInvalidSignatureS",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "error",
        "type": "bytes"
      }
    ],
    "name": "ExecuteError",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OpenfortBaseAccount7702V1__InvalidNonce",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OpenfortBaseAccount7702V1__InvalidSignature",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OpenfortBaseAccount7702V1__InvalidTransactionLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OpenfortBaseAccount7702V1__InvalidTransactionTarget",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "returnData",
        "type": "bytes"
      }
    ],
    "name": "OpenfortBaseAccount7702V1__TransactionFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OpenfortBaseAccount7702V1__ValidationExpired",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "bits",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "SafeCastOverflowedUintDowncast",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SessionKeyManager__AddressCantBeZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SessionKeyManager__InvalidTimestamp",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SessionKeyManager__SelectorsListTooBig",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SessionKeyManager__SessionKeyInactive",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SessionKeyManager__SessionKeyRegistered",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "bytes32",
                "name": "x",
                "type": "bytes32"
              },
              {
                "internalType": "bytes32",
                "name": "y",
                "type": "bytes32"
              }
            ],
            "internalType": "struct ISessionKey.PubKey",
            "name": "pubKey",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "eoaAddress",
            "type": "address"
          },
          {
            "internalType": "enum ISessionKey.KeyType",
            "name": "keyType",
            "type": "uint8"
          }
        ],
        "indexed": true,
        "internalType": "struct ISessionKey.Key",
        "name": "masterKey",
        "type": "tuple"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "sessionKey",
        "type": "bytes32"
      }
    ],
    "name": "SessionKeyRegistrated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "sessionKey",
        "type": "bytes32"
      }
    ],
    "name": "SessionKeyRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "TransactionExecuted",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "DEAD_ADDRESS",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_SELECTORS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_OPENFORT_CONTRACT_ADDRESS",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "encodeEOASignature",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "x",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "y",
            "type": "bytes32"
          }
        ],
        "internalType": "struct ISessionKey.PubKey",
        "name": "pubKey",
        "type": "tuple"
      }
    ],
    "name": "encodeP256NonKeySignature",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "x",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "y",
            "type": "bytes32"
          }
        ],
        "internalType": "struct ISessionKey.PubKey",
        "name": "pubKey",
        "type": "tuple"
      }
    ],
    "name": "encodeP256Signature",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "requireUserVerification",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "authenticatorData",
        "type": "bytes"
      },
      {
        "internalType": "string",
        "name": "clientDataJSON",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "challengeIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "typeIndex",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "x",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "y",
            "type": "bytes32"
          }
        ],
        "internalType": "struct ISessionKey.PubKey",
        "name": "pubKey",
        "type": "tuple"
      }
    ],
    "name": "encodeWebAuthnSignature",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "entryPoint",
    "outputs": [
      {
        "internalType": "contract IEntryPoint",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct OPF7702.Transaction[]",
        "name": "_transactions",
        "type": "tuple[]"
      }
    ],
    "name": "execute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_calldata",
        "type": "bytes"
      }
    ],
    "name": "execute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "target",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "internalType": "struct BaseAccount.Call[]",
        "name": "calls",
        "type": "tuple[]"
      }
    ],
    "name": "executeBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_target",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_value",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "_calldata",
        "type": "bytes[]"
      }
    ],
    "name": "executeBatch",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "enum ISessionKey.KeyType",
        "name": "_keyType",
        "type": "uint8"
      }
    ],
    "name": "getKeyById",
    "outputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "bytes32",
                "name": "x",
                "type": "bytes32"
              },
              {
                "internalType": "bytes32",
                "name": "y",
                "type": "bytes32"
              }
            ],
            "internalType": "struct ISessionKey.PubKey",
            "name": "pubKey",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "eoaAddress",
            "type": "address"
          },
          {
            "internalType": "enum ISessionKey.KeyType",
            "name": "keyType",
            "type": "uint8"
          }
        ],
        "internalType": "struct ISessionKey.Key",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "enum ISessionKey.KeyType",
        "name": "_keyType",
        "type": "uint8"
      }
    ],
    "name": "getKeyRegistrationInfo",
    "outputs": [
      {
        "internalType": "enum ISessionKey.KeyType",
        "name": "keyType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "registeredBy",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
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
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_keyHash",
        "type": "bytes32"
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
  },
  {
    "inputs": [],
    "name": "id",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "idEOA",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "idSessionKeys",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "x",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "y",
            "type": "bytes32"
          }
        ],
        "internalType": "struct ISessionKey.PubKey",
        "name": "pubKey",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "eoaAddress",
        "type": "address"
      },
      {
        "internalType": "enum ISessionKey.KeyType",
        "name": "keyType",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "idEOA",
        "type": "uint256"
      }
    ],
    "name": "idSessionKeysEOA",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "x",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "y",
            "type": "bytes32"
          }
        ],
        "internalType": "struct ISessionKey.PubKey",
        "name": "pubKey",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "eoaAddress",
        "type": "address"
      },
      {
        "internalType": "enum ISessionKey.KeyType",
        "name": "keyType",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "bytes32",
                "name": "x",
                "type": "bytes32"
              },
              {
                "internalType": "bytes32",
                "name": "y",
                "type": "bytes32"
              }
            ],
            "internalType": "struct ISessionKey.PubKey",
            "name": "pubKey",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "eoaAddress",
            "type": "address"
          },
          {
            "internalType": "enum ISessionKey.KeyType",
            "name": "keyType",
            "type": "uint8"
          }
        ],
        "internalType": "struct ISessionKey.Key",
        "name": "_key",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          }
        ],
        "internalType": "struct SpendLimit.SpendTokenInfo",
        "name": "_spendTokenInfo",
        "type": "tuple"
      },
      {
        "internalType": "bytes4[]",
        "name": "_allowedSelectors",
        "type": "bytes4[]"
      },
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "_validUntil",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_nonce",
        "type": "uint256"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "keyHash",
        "type": "bytes32"
      }
    ],
    "name": "isSessionKeyActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "eoaKey",
        "type": "address"
      }
    ],
    "name": "isSessionKeyActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "isValidSignature",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "magicValue",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155BatchReceived",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC721Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "bytes32",
                "name": "x",
                "type": "bytes32"
              },
              {
                "internalType": "bytes32",
                "name": "y",
                "type": "bytes32"
              }
            ],
            "internalType": "struct ISessionKey.PubKey",
            "name": "pubKey",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "eoaAddress",
            "type": "address"
          },
          {
            "internalType": "enum ISessionKey.KeyType",
            "name": "keyType",
            "type": "uint8"
          }
        ],
        "internalType": "struct ISessionKey.Key",
        "name": "_key",
        "type": "tuple"
      },
      {
        "internalType": "uint48",
        "name": "_validUntil",
        "type": "uint48"
      },
      {
        "internalType": "uint48",
        "name": "_validAfter",
        "type": "uint48"
      },
      {
        "internalType": "uint48",
        "name": "_limit",
        "type": "uint48"
      },
      {
        "internalType": "bool",
        "name": "_whitelisting",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "_contractAddress",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          }
        ],
        "internalType": "struct SpendLimit.SpendTokenInfo",
        "name": "_spendTokenInfo",
        "type": "tuple"
      },
      {
        "internalType": "bytes4[]",
        "name": "_allowedSelectors",
        "type": "bytes4[]"
      },
      {
        "internalType": "uint256",
        "name": "_ethLimit",
        "type": "uint256"
      }
    ],
    "name": "registerSessionKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revokeAllSessionKeys",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              {
                "internalType": "bytes32",
                "name": "x",
                "type": "bytes32"
              },
              {
                "internalType": "bytes32",
                "name": "y",
                "type": "bytes32"
              }
            ],
            "internalType": "struct ISessionKey.PubKey",
            "name": "pubKey",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "eoaAddress",
            "type": "address"
          },
          {
            "internalType": "enum ISessionKey.KeyType",
            "name": "keyType",
            "type": "uint8"
          }
        ],
        "internalType": "struct ISessionKey.Key",
        "name": "_key",
        "type": "tuple"
      }
    ],
    "name": "revokeSessionKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "sessionKey",
        "type": "bytes32"
      }
    ],
    "name": "sessionKeys",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "x",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "y",
            "type": "bytes32"
          }
        ],
        "internalType": "struct ISessionKey.PubKey",
        "name": "pubKey",
        "type": "tuple"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint48",
        "name": "validUntil",
        "type": "uint48"
      },
      {
        "internalType": "uint48",
        "name": "validAfter",
        "type": "uint48"
      },
      {
        "internalType": "uint48",
        "name": "limit",
        "type": "uint48"
      },
      {
        "internalType": "bool",
        "name": "masterSessionKey",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "whitelisting",
        "type": "bool"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          }
        ],
        "internalType": "struct SpendLimit.SpendTokenInfo",
        "name": "spendTokenInfo",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "ethLimit",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "whoRegistrated",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sessionKeyEOA",
        "type": "address"
      }
    ],
    "name": "sessionKeysEOA",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "x",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "y",
            "type": "bytes32"
          }
        ],
        "internalType": "struct ISessionKey.PubKey",
        "name": "pubKey",
        "type": "tuple"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint48",
        "name": "validUntil",
        "type": "uint48"
      },
      {
        "internalType": "uint48",
        "name": "validAfter",
        "type": "uint48"
      },
      {
        "internalType": "uint48",
        "name": "limit",
        "type": "uint48"
      },
      {
        "internalType": "bool",
        "name": "masterSessionKey",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "whitelisting",
        "type": "bool"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          }
        ],
        "internalType": "struct SpendLimit.SpendTokenInfo",
        "name": "spendTokenInfo",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "ethLimit",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "whoRegistrated",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "_interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "challenge",
        "type": "bytes32"
      }
    ],
    "name": "usedChallenges",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isUsed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation",
        "name": "userOp",
        "type": "tuple"
      },
      {
        "internalType": "bytes32",
        "name": "userOpHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "missingAccountFunds",
        "type": "uint256"
      }
    ],
    "name": "validateUserOp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "validationData",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "challenge",
        "type": "bytes"
      },
      {
        "internalType": "bool",
        "name": "requireUserVerification",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "encodedAuth",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "x",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "y",
        "type": "bytes32"
      }
    ],
    "name": "verifyCompactSignature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "challenge",
        "type": "bytes"
      },
      {
        "internalType": "bool",
        "name": "requireUserVerification",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "encodedAuth",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "x",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "y",
        "type": "bytes32"
      }
    ],
    "name": "verifyEncodedSignature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "x",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "y",
        "type": "bytes32"
      }
    ],
    "name": "verifyP256Signature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "challenge",
        "type": "bytes32"
      },
      {
        "internalType": "bool",
        "name": "requireUserVerification",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "authenticatorData",
        "type": "bytes"
      },
      {
        "internalType": "string",
        "name": "clientDataJSON",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "challengeIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "typeIndex",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "x",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "y",
        "type": "bytes32"
      }
    ],
    "name": "verifySoladySignature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const;