
export const verifierABI = [
  {
    "type": "function",
    "name": "verifyCompactSignature",
    "inputs": [
      {
        "name": "challenge",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "requireUserVerification",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "encodedAuth",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "x",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "y",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "isValid",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyEncodedSignature",
    "inputs": [
      {
        "name": "challenge",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "requireUserVerification",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "encodedAuth",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "x",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "y",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "isValid",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyP256Signature",
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "x",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "y",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "isValid",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifySoladySignature",
    "inputs": [
      {
        "name": "challenge",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "requireUserVerification",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "authenticatorData",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "clientDataJSON",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "challengeIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "typeIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "x",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "y",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "isValid",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  }
] as const;