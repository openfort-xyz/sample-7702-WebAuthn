"use client";

import cookie from "cookiejs";
import { useEffect, useMemo } from "react";
import { Hex, http } from "viem";
import { createBundlerClient, entryPoint08Address } from "viem/account-abstraction";
import { useAppContext } from "../lib/AppContext/useAppContext";
import { getPublicClient } from "../lib/getPublicClient";
import { usePaymasterClient } from "../lib/hooks/usePaymasterClient";
import { toOpenfortSmartAccount } from "../lib/toOpenfortAccount";
import { CreateSessionKeyCard } from "./components/CreateSessionKeyCard";
import { MintAndTransferWithSessionKeyCard } from "./components/MintAndTransferWithSessionKeyCard";
import { MintWithSessionKeyCard } from "./components/MintWithSessionKeyCard";
import { MintWithWebAuthnCard } from "./components/MintWithWebAuthnCard";
import { YourWalletCard } from "./components/YourWalletCard";
import { FAQSection } from "./components/FAQSection";

const COOKIE_SELECTED_WALLET = 'opf.selectedWallet';
const COOKIE_SELECTED_CREDENTIAL_ID = 'opf.selectedCredentialId';

export default function Content() {
  const { paymasterClient, paymasterUrl, getGasPrice } = usePaymasterClient();
  const publicClient = useMemo(() => getPublicClient(), []);

  const {
    smartAccountClient,
    setSmartAccountClient,
    setPasskeyCredentialId,
    updateBalance,
    chain,
  } = useAppContext();

  useEffect(() => {
    const selectedWallet = cookie.get(COOKIE_SELECTED_WALLET);
    const selectedCredentialId = cookie.get(COOKIE_SELECTED_CREDENTIAL_ID);

    if (selectedWallet && selectedCredentialId) {
      const init = async () => {
        const account = await toOpenfortSmartAccount({
          address: selectedWallet as Hex,
          client: publicClient,
          entryPointAddress: entryPoint08Address,
          credentialId: selectedCredentialId as string,
        })

        const smartAccountClient = createBundlerClient({
          account,
          chain,
          transport: http(paymasterUrl),
          paymaster: paymasterClient,
          userOperation: {
            estimateFeesPerGas: async () => {
              return (await getGasPrice()).fast;
            },
          },
        });

        setSmartAccountClient(smartAccountClient);
        setPasskeyCredentialId(selectedCredentialId as string);
      }
      init();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (smartAccountClient && smartAccountClient.account) {
      updateBalance();
    }
  }, [updateBalance, smartAccountClient]);

  return (
    <>
      <div className="container mx-auto max-w-4xl p-4 space-y-6">
        <header className="flex items-center justify-between p-4 border-b border-base-200">
          <a href="https://www.openfort.io/" target="_blank" className="relative z-10">
            <svg viewBox="0 0 39 11" aria-hidden="true" className="h-10 w-auto"><path className="fill-zinc-400" transform="translate(0, 5) scale(0.04)" d="m75.9 72.3h18.2v32.4h-18.2zm94.8 32.3h-18.2v-87.1h-135v87.1h-18.2v-105.2h13.5v-0.1h157.9v0.1zm-36.5-50.7h-0.1v50.7h-18.2v-50.7h-61.9v50.7h-18.2v-66.5-2.4h98.4z"></path><path className="fill-zinc-400" transform="scale(0.04) translate(220, 90)" d="m48.4 137.1q-14.9 0-25.8-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6.1-27.3 6-11.7 16.9-18.3 10.9-6.5 25.5-6.5 14.8 0 25.7 6.6 10.9 6.7 16.9 18.5 5.9 11.7 5.9 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.6 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.9 4.4-6.2 4.3-9.2 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.6 59.3v-142.9h17v8.9q2.6-2.7 5.6-4.8 9.5-6.8 23.5-6.8 14 0 24.1 6.8 10.1 6.8 15.6 18.6 5.5 11.8 5.5 26.7 0 14.8-5.5 26.7-5.4 11.8-15.4 18.7-10.1 6.9-23.9 6.9-14.2 0-23.8-6.9-1.8-1.3-3.5-2.8v50.9c0 0-19.2 0-19.2 0zm43.9-58.5q9.1 0 15.1-4.7 6-4.7 9-12.6 3-7.9 3-17.7 0-9.7-3-17.6-3-7.9-9.1-12.5-6.1-4.7-15.7-4.7-8.9 0-14.8 4.4-5.8 4.4-8.6 12.3-2.8 7.8-2.8 18.1 0 10.3 2.8 18.1 2.7 7.9 8.7 12.4 5.9 4.5 15.4 4.5zm111.4 17.3q-14.7 0-25.8-6.5-11.2-6.4-17.4-18-6.1-11.6-6.1-26.9 0-16.2 6-28.1 6.1-11.9 17-18.4 10.9-6.5 25.4-6.5 15.1 0 25.7 7 10.7 7 15.9 19.9 5.3 12.9 4.2 30.7h-9.5v-0.3h-9.6v0.3h-54.1v0.7h-0.4q1.1 11.9 6.9 19.1 7.3 8.9 20.9 9 9 0 15.5-4.1 6.6-4.1 10.2-11.7l18.8 5.9q-5.8 13.3-17.5 20.6-11.7 7.3-26.1 7.3zm19.2-79.2q-6.4-8.3-19.4-8.3-14.3 0-21.6 9.1-4.9 6.2-6.5 16.2v0.5l53-0.1v-0.3h0.5q-1.3-11-6-17.1zm43.4 76.4v-98.9h17.1v11.9q4.1-5.2 9.9-8.8 9.5-5.7 22.8-5.7 10.3 0 17.3 3.3 6.9 3.3 11.3 8.6 4.3 5.4 6.6 11.7 2.3 6.3 3.1 12.4 0.8 6 0.8 10.6v55h-19.4v-48.7q0-5.8-0.9-11.9-1-6-3.7-11.3-2.7-5.2-7.6-8.4-4.9-3.2-12.8-3.2-5.1 0-9.7 1.7-4.6 1.7-8 5.4-3.4 3.8-5.4 9.9-2 6.2-2 15v51.4zm105.4-83.5v-15.4h16.4v-3.5q0-3.7 0.3-8 0.3-4.2 1.6-8.4 1.3-4.2 4.5-7.7 3.7-4.1 8.2-5.8 4.5-1.8 8.9-2 4.5-0.3 8.2-0.3h12.5v15.8h-11.5q-6.8-0.1-10.2 3.3-3.3 3.3-3.3 9.5v7.1h25v15.4h-25v83.5h-19.2v-83.5zm114.5 86.3q-14.8 0-25.7-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6-27.3 6.1-11.7 17-18.3 10.9-6.5 25.4-6.5 14.9 0 25.8 6.6 10.9 6.7 16.8 18.5 6 11.7 6 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.7 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.8 4.4-6.3 4.3-9.3 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.7-83.6h17.1v15.8q1.1-1.9 2.3-3.7 3-3.9 6.8-6.5 3.8-2.8 8.4-4.3 4.6-1.5 9.5-1.8 4.8-0.3 9.3 0.5v17.9q-4.8-1.2-10.7-0.7-5.9 0.6-10.9 3.8-4.7 3-7.4 7.3-2.7 4.3-3.9 9.6-1.2 5.2-1.2 11.1v49.9h-19.3zm17.1 15.8q-0.5 0.9-1 1.8h1zm42.7-0.4v-15.4h19v-27.5h19.2v27.5h29.4v15.4h-29.4v43.7q0 5.9 0.2 10.3 0.1 4.4 1.9 7.4 3.2 5.7 10.4 6.5 7.2 0.8 16.9-0.6v16.2q-9.3 1.9-18.3 1.6-9-0.3-16-3.5-7.1-3.2-10.7-10.1-3.2-6.1-3.4-12.5-0.2-6.3-0.2-14.4v-44.6z"></path></svg>
          </a>
          <a href="https://github.com/openfort-xyz/sample-7702-WebAuthn/" target="_blank">
            <button className="btn btn-sm hover:bg-base-300">
              <div className="w-4 h-4 mr-0.5">
                <svg width="100%" height="100%" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff" /></svg>
              </div>
              View source code
            </button>
          </a>
        </header>

        {/* Announcement Banner */}
        <div className="bg-base-200 w-full">
          <div className="container mx-auto max-w-4xl">
            <a href="https://www.openfort.io/blog/building-a-passwordless-wallet" target="_blank" className="relative my-4 bg-base-200 rounded-lg p-4 flex items-center justify-between border border-base-300 hover:bg-base-300 transition-colors duration-200">
              <p className="text-base-content">Learn about the EIP-7702 Designator Capabilities</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2z"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-4">
          Passkey Wallet Implementation
        </h1>
        <p className="mb-6 text-lg text-base-content/80">
          The following is a <strong>demo</strong> to show how to use Openfort EIP-7702 with ERC-4337.
          It uses the <a className="underline" href="https://github.com/openfort-xyz/openfort-7702-account" target="_blank" rel="noopener noreferrer">7702 Account</a> from Openfort with <a className="underline" href="https://viem.sh/" target="_blank" rel="noopener noreferrer">Viem</a>.
          This demo includes: WebAuthn, sponsored transactions, batch transactions, and session keys.
        </p>

        <article className="space-y-4 border-b-2 border-base-300 mb-4 pb-4">

          <h2 className="text-2xl font-bold">
            Initialize an account
          </h2>

          <p className="text-base-content/80">
            Firstly, we will initialize an Account (EOA). You can either click on &quot;Register&quot; to create a new Account, or &quot;Sign In&quot; to sign into an existing one that you have created previously.
          </p>

          <YourWalletCard />

          <p className="text-base-content/80">
            By clicking the &quot;Register&quot; button above, behind the scenes it will:
          </p>
          <ol className="list-decimal list-inside" start={1}>
            <li>Generate an Account (EOA) with a random private key.</li>
            <li>Prompt the end-user to create a WebAuthn key (e.g. Passkey).</li>
            <li>Sign an EIP-7702 Authorization to designate the Delegation contract onto the Account.</li>
            <li>Send an EIP-7702 Transaction with the Authorization from Step 3, and authorize the WebAuthn public key on the Account.</li>
            <li>Store the account <strong>address</strong> we are using in local storage.</li>
          </ol>

        </article>

        <article className="space-y-4 border-b-2 border-base-300 mb-4 pb-4">
          <h2 className="text-2xl font-bold">
            Execute a sponsored transaction
          </h2>

          <p className="text-base-content/80">
            Next, let&apos;s demonstrate executing a contract call using our Account (EOA) that is controlled by our WebAuthn key.
          </p>

          <MintWithWebAuthnCard />

          <p className="text-base-content/80">
            The mint transaction is coordinating with the paymaster to sponsor the transaction.
          </p>
          <ul className="list-disc list-inside">
            <li>Prompting the end-user to sign over the call with their WebAuthn key (e.g. Passkey)</li>
            <li>Invoking the mint function on the Account (which uses a paymaster) with the calldata and the WebAuthn signature. The Delegation contract uses the RIP-7212 P256 Precompile to verify the WebAuthn signature.</li>
            <li>Upon invoking the mint function, we are broadcasting a userop to the bundler.</li>
          </ul>
        </article>

        <article className="space-y-4 border-b-2 border-base-300 mb-4 pb-4">
          <h2 className="text-2xl font-bold">
            Using a session key
          </h2>

          <p className="text-base-content/80">
            Now, let&apos;s demonstrate how to use a session key to perform the same action. A session key is a temporary key that can be used to sign transactions on behalf of the user without requiring them to sign each transaction individually.
          </p>
          <p className="text-base-content/80">
            This time, we generate a temporary key (a non-extractable P256 key) and use it as an account session key. The session key is then stored in IndexedDB (as an example implementation) and authorized along with the WebAuthn P256 key.
          </p>
          <p className="text-base-content/80">
            The session key is used to sign the transaction, and it is limited to a certain number of actions (e.g. 10 actions for this demo).
          </p>

          <CreateSessionKeyCard />

          <MintWithSessionKeyCard />

          <p className="text-base-content/80">
            Session keys are solving user experience issues with prompt fatigue and reviewing signature requests. With this example, once you create a session key, you are free to perform actions without getting prompted for signatures.
          </p>

          <p className="text-base-content/80">
            This allows you to perform multiple actions (batch transaction) with the session key without needing to sign each transaction.
          </p>

          <MintAndTransferWithSessionKeyCard />

        </article>

        <FAQSection />
      </div >
    </ >
  );
}
