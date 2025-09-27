'use client';
import Script from 'next/script';

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Openfort",
    "url": "https://www.openfort.io",
    "logo": "https://passkey-wallet.com/images/og.png",
    "sameAs": [
      "https://x.com/openfort_xyz",
      "https://github.com/openfort-xyz"
    ],
    "description": "Openfort provides seamless Web3 authentication and wallet infrastructure for developers"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Passkey Wallet Demo",
    "url": "https://passkey-wallet.com",
    "description": "Interactive demo of a seedless Ethereum wallet with EIP-7702 and ERC-4337",
    "publisher": {
      "@type": "Organization",
      "name": "Openfort"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a passkey wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A passkey wallet lets you log in and use your wallet without passwords or seed phrases. It uses your device's built-in security (like Face ID, Touch ID, or a hardware key) to keep your assets safe and easy to access."
        }
      },
      {
        "@type": "Question",
        "name": "How is this different from a regular crypto wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional wallets often ask you to store seed phrases or private keys, which can be confusing and risky. Passkey wallets remove that hassle while keeping the same security, sometimes even stronger."
        }
      },
      {
        "@type": "Question",
        "name": "Can I still use my wallet across multiple devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. With passkeys, you can connect your wallet to different devices as long as you use the same account (like Apple, Google, or another identity provider). It's secure and syncs easily."
        }
      },
      {
        "@type": "Question",
        "name": "Is a passkey wallet safe for developers to integrate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Passkey wallets follow industry security standards and reduce the risk of user mistakes (like losing a seed phrase). Platforms like Openfort make it even easier for developers to add passkey-based wallets directly into apps and games."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to download an app to use it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not always. Many passkey wallets work directly in your browser or inside the app you're using. With Openfort, for example, users don't need a separate app, wallets are embedded right into the experience."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use a passkey wallet for stablecoins and payments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You can hold, send, and receive stablecoins just like with any other wallet. This makes passkey wallets great for simple payments and everyday transactions."
        }
      }
    ]
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Passkey Wallet",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": "Seedless Ethereum wallet using passkeys and WebAuthn for secure authentication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Openfort"
    },
    "featureList": [
      "WebAuthn authentication",
      "EIP-7702 account abstraction",
      "Sponsored transactions",
      "Session keys",
      "No seed phrases required"
    ]
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema)
        }}
      />
    </>
  );
}