import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "../lib/AppContext/appContextProvider";
import { PosthogProvider } from "./PosthogProvider";
import { StructuredData } from "./components/StructuredData";

export const metadata: Metadata = {
  title: "Passkey Wallet - Seedless Ethereum Wallet | Openfort Demo",
  description: "Create a secure Ethereum wallet in seconds using passkeys. No seed phrases, no passwords. Features EIP-7702 account abstraction, WebAuthn security, gasless transactions, and session keys for seamless Web3 UX.",
  keywords: "Ethereum wallet, WebAuthn, Passkey, EIP-7702, ERC-4337, account abstraction, seedless wallet, Openfort, blockchain, DeFi, smart accounts, gasless transactions, Web3 authentication",
  authors: [{ name: "Openfort" }],
  creator: "Openfort",
  publisher: "Openfort",
  metadataBase: new URL('https://passkey-wallet.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Passkey Wallet - Seedless Ethereum Wallet Demo",
    description: "Interactive demo of a seedless Ethereum wallet with EIP-7702 and ERC-4337. Features WebAuthn authentication, sponsored transactions, and session keys.",
    url: "https://passkey-wallet.com",
    siteName: "Openfort Passkey Wallet Demo",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Passkey Wallet - Seedless Ethereum Wallet Demo by Openfort"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Passkey Wallet - Seedless Ethereum Wallet Demo",
    description: "Interactive demo of a seedless Ethereum wallet with EIP-7702 and ERC-4337. Features WebAuthn authentication, sponsored transactions, and session keys.",
    images: ["/images/og.png"],
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
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
          <body>
            {children}
            <StructuredData />
          </body>
        </html>
      </AppContextProvider>
    </PosthogProvider>
  );
}
