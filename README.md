# P256 Signatures with WebAuthn: Building Secure Smart Accounts with Passkeys

Web3 security has long relied on users managing private keys—a significant barrier to mainstream adoption. In this post, we'll explore how WebAuthn and P256 signatures can revolutionize smart account security by eliminating the need for users to handle private keys directly.

We'll demonstrate how to build a complete smart account system that:

- Creates secure passkeys using WebAuthn.
- Initializes session keys with non-extractable keys.
- Signs and executes transactions with the session keys.
- Sponsored and batched transactions using EIP-7702.
- EIP-4337 based relaying and paymasters.

## Why WebAuthn + P256 for Smart Accounts?

Traditional wallets expose private keys to the application layer, creating multiple attack vectors. WebAuthn fundamentally changes this by keeping private keys in secure hardware (like your device's secure enclave or a hardware security key) where they can never be extracted.

When combined with account abstraction standards like EIP-4337 and EIP-7702, this approach delivers:

- **Enhanced Security**: Private keys never leave the secure hardware
- **Superior UX**: No seed phrases or key management for users
- **Cross-Platform Compatibility**: Works across devices with biometric authentication
- **Future-Proof**: Leverages widely adopted web standards

Let's build this step by step.

## Setting Up WebAuthn Authentication

### Creating Your First Passkey

The journey begins by creating a WebAuthn credential that will serve as the primary authentication method for your smart account. This credential is tied to your device and protected by biometric authentication or a PIN.

```javascript
import { Bytes, WebAuthnP256 } from "ox";

// Create a WebAuthn credential using the account address as the user ID
const credential = await WebAuthnP256.createCredential({
  authenticatorSelection: {
    requireResidentKey: false,
    residentKey: "preferred",        // Store credential on device when possible
    userVerification: "required",    // Require biometric/PIN verification
  },
  user: {
    id: Bytes.from(account.address),
    name: `${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
  },
});

// Store the credential ID for future authentication
const credentialId = credential.id;
```

This process prompts the user to authenticate (via Face ID, Touch ID, Windows Hello, etc.) and creates a unique key pair bound to their device. The private key remains in secure hardware, while the public key is returned for smart account initialization.

### Initializing the Smart Account

With the WebAuthn credential created, we can now initialize a smart account that recognizes this passkey as its primary signer:

```javascript
// Prepare the initialization call data
const callData = encodeFunctionData({
  abi: accountABI,
  functionName: "initialize",
  args: [
    {                               
      pubKey: {                         
        x: toHex(x),                   // The WebAuthn public key x coordinate
        y: toHex(y),                   // The WebAuthn public key y coordinate
      },
      eoaAddress: zeroAddress,         // address(0)
      keyType: KEY_TYPE_WEBAUTHN,      // WEBAUTHN key type identifier
    },
    spendTokenInfo,                    // Token spending configuration
    [                                  // Function selectors this key can call
      '0xa9059cbb',                    // transfer(address,uint256)
      '0x40c10f19'                     // mint(address,uint256)
    ],
    messageHash,                       // Verification message hash
    signatureInit,                     // Initial signature for verification
    validUntil,                        // Key expiration timestamp
    nonce + 1n,                        // Account nonce
  ],
});

// Create the user operation with EIP-7702 authorization
const userOperation = await walletClient.prepareUserOperation({
  callData,
  authorization: signedAuthorization,  // EIP-7702 authorization signature
});
```

The EIP-7702 authorization allows an EOA to temporarily act as a smart contract, enabling the initialization process. Once this UserOperation is executed, your smart account is ready for WebAuthn-based transactions.

## Executing Transactions with WebAuthn

### Preparing the Transaction

Let's demonstrate by minting some ERC-20 tokens. The process involves preparing a UserOperation with a placeholder signature, then replacing it with the actual WebAuthn signature:

```javascript
// Encode the mint function call
const data = encodeFunctionData({
  abi: erc20ABI,
  functionName: "mint",
  args: [
    walletClient.account.address,
    parseEther("10"),  // Mint 10 tokens
  ],
});

// Prepare UserOperation with stub signature
const userOperation = await walletClient.prepareUserOperation({
  calls: [
    {
      to: erc20Address,
      data,
    },
  ],
  signature: webAuthnStubSignature,  // Placeholder signature
});
```

### Signing with WebAuthn

Now we generate the actual signature using the WebAuthn credential:

```javascript
// Get the UserOperation hash that needs to be signed
const userOperationHash = getUserOperationHash(userOperation);

// Sign with WebAuthn - this triggers biometric authentication
const webauthnData = await WebAuthnP256.sign({
  challenge: userOperationHash,
  credentialId,                      // The credential we created earlier
  rpId: window.location.hostname,    // Relying party identifier
  userVerification: "required",      // Require user verification
});

// Replace stub signature with the actual WebAuthn signature
userOperation.signature = encodeWebAuthnSignature(webauthnData);

// Send to bundler for execution
await bundlerClient.sendUserOperation(userOperation);
```

The user experiences a familiar biometric prompt (Face ID, fingerprint, etc.), and once authenticated, the transaction is signed and submitted.

## Implementing Session Keys for Seamless UX

While WebAuthn provides excellent security, requiring biometric authentication for every transaction can impact user experience. Session keys solve this by creating temporary, limited-privilege keys for routine operations.

### Creating a Session Key

Session keys are also non-extractable P256 keys, but they're created using the WebCrypto API and stored locally:

```javascript
import { WebCryptoP256 } from "ox";

// Generate a new P256 key pair for the session
const keyPair = await WebCryptoP256.createKeyPair();
const publicKey = await WebCryptoP256.getPublicKey({ 
  publicKey: keyPair.publicKey 
});

// Store the key pair securely (e.g., in IndexedDB)
await storeSessionKey(keyPair);
```

### Registering the Session Key

The session key must be registered with the smart account, defining its permissions and validity:

```javascript
const callData = encodeFunctionData({
  abi: accountABI,
  functionName: 'registerSessionKey',
  args: [
    {
      pubKey: {
        x: toHex(publicKey.x),         // The P256 public key x coordinate
        y: toHex(publicKey.y),         // The P256 public key y coordinate
      },
      eoaAddress: zeroAddress,         // address(0)
      keyType: KEY_TYPE_P256,          // P256 key type identifier
    },
    validUntil,                        // Session expiration
    0,                                 // Nonce
    limits,                            // Spending/call limits
    true,                              // Authorized flag
    erc20Address,                      // Contract this key can interact with
    spendTokenInfo,                    // Token spending configuration
    [                                  // Function selectors this key can call
      '0xa9059cbb',                    // transfer(address,uint256)
      '0x40c10f19'                     // mint(address,uint256)
    ],
    ethLimit                           // ETH spending limit
  ]
});

// This registration requires WebAuthn approval
const userOperation = await walletClient.prepareUserOperation({
  callData,
  signature: webAuthnStubSignature,
});

// Sign with WebAuthn (one-time approval for session key)
const webauthnData = await WebAuthnP256.sign({
  challenge: getUserOperationHash(userOperation),
  credentialId,
  rpId: window.location.hostname,
  userVerification: "required",
});
```

### Using Session Keys for Transactions

Once registered, session keys can sign transactions without requiring biometric authentication:

```javascript
// Prepare the transaction as before
const userOperation = await walletClient.prepareUserOperation({
  calls: [
    {
      to: erc20Address,
      data: encodeFunctionData({
        abi: erc20ABI,
        functionName: "mint",
        args: [walletClient.account.address, parseEther("10")],
      }),
    },
  ],
  signature: P256StubSignature,        // Different stub for P256 keys
});

// Sign with the session key (no user interaction required)
const { r, s } = await WebCryptoP256.sign({
  privateKey: sessionKey.privateKey,
  payload: getUserOperationHash(userOperation),
});

// Format and attach the signature
userOperation.signature = encodeP256Signature({ r, s });

// Submit the transaction
await bundlerClient.sendUserOperation(userOperation);
```

## Conclusion

WebAuthn with P256 signatures represents a significant leap forward in Web3 user experience and security. By eliminating private key exposure and leveraging familiar authentication methods, we can build smart accounts that are both more secure and more user-friendly than traditional wallets.

The combination of WebAuthn for high-security operations and session keys for routine transactions creates a system that adapts to different security contexts—requiring strong authentication for sensitive actions while enabling frictionless interactions for everyday use.

As account abstraction standards mature and WebAuthn support expands, this approach will become increasingly viable for mainstream Web3 applications. The future of Web3 security isn't about teaching users to manage private keys—it's about making security invisible and automatic.
