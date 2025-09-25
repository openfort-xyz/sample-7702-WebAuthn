import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import { AppContextProvider } from "../lib/AppContext/appContextProvider";
import { PosthogProvider } from "./PosthogProvider";

export const metadata: Metadata = {
  title: "Passkey Wallet - Seedless Ethereum Wallet with EIP-7702 & ERC-4337 | Openfort Demo",
  description: "Experience the future of Ethereum wallets with our Passkey Wallet demo. Built by Openfort, featuring EIP-7702 designator capabilities, WebAuthn authentication, sponsored transactions, and session keys.",
  keywords: "Ethereum wallet, WebAuthn, Passkey, EIP-7702, ERC-4337, account abstraction, seedless wallet, Openfort, blockchain, DeFi, smart accounts",
  authors: [{ name: "Openfort" }],
  creator: "Openfort",
  publisher: "Openfort",
  openGraph: {
    title: "Passkey Wallet - Seedless Ethereum Wallet Demo | Openfort",
    description: "Interactive demo of a seedless Ethereum wallet with EIP-7702 and ERC-4337. Features WebAuthn authentication, sponsored transactions, and session keys.",
    url: "https://sample-7702-webauthn.vercel.app/",
    siteName: "Openfort Passkey Wallet Demo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Passkey Wallet"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Passkey Wallet - Seedless Ethereum Wallet Demo | Openfort",
    description: "Interactive demo of a seedless Ethereum wallet with EIP-7702 and ERC-4337. Features WebAuthn authentication, sponsored transactions, and session keys.",
    images: ["/og-image.png"],
    creator: "@openfort_xyz"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: "your-google-site-verification-code"
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PosthogProvider>
      <AppContextProvider>
        <html lang="en">
          <Head>
            <link rel="icon" href="/favicon.ico" />
            {/* Optional: for .png favicon */}
            {/* <link rel="icon" type="image/png" href="/favicon.png" /> */}
          </Head>
          <body>{children}</body>
        </html>
      </AppContextProvider>
    </PosthogProvider>
  );
}
