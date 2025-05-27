import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import { AppContextProvider } from "../lib/AppContext/appContextProvider";
import { PosthogProvider } from "./PosthogProvider";

export const metadata: Metadata = {
  title: "Openfort 7702 Demo",
  description: "Openfort implementation of EIP-7702 with ERC-4337",
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
