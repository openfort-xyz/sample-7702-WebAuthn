
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Metadata } from "next";

const Index = () => {

  
    const faqData = [
      {
        question: 'What is Openfort?',
        answer:
          'Openfort is a wallet-as-a-service platform for embedded (in-app) wallets. It bundles passkeys, account abstraction, gas sponsorship, and orchestration so you don’t juggle multiple vendors.',
      },
      {
        question: 'Can I build stablecoin accounts and payments?',
        answer:
          'Yes. You can add USDC and other stablecoins for deposits, payouts, or in-app balances, and even sponsor gas so users don’t need native tokens.',
      },
      {
        question: 'Do users need seed phrases or crypto to get started?',
        answer:
          'No. Users sign in with passkeys or email/social, no seed phrases and you can cover gas with a paymaster so transactions feel like a normal app.',
      },
      {
        question: 'Can I self-host Openfort?',
        answer:
          'Yes. You can run the key management system for maximum control or use our managed option; you can switch later without lock-in.',
      },
      {
        question: 'Which chains and SDKs are supported?',
        answer:
          'Openfort supports EVM and SVM chains, with SDKs for web, iOS/Android, and game engines like Unity. It works with ERC-4337 smart accounts and supports ERC-7702 where available.',
      },
      {
        question: 'How is Openfort different from other wallet providers?',
        answer:
          'Openfort is a self-hostable, end-to-end wallet platform. It combines authentication, embedded wallets, passkeys, account abstraction (ERC-4337/7702), gas sponsorship, webhooks, and analytics in one place.',
      },
    ]
  
    const FAQItem = ({ question, answer, isOpen, toggleOpen }: { question: string, answer: string, isOpen: boolean, toggleOpen: () => void }) => {
      return (
        <div
          className="faq-item mb-3 cursor-pointer p-4 transition-all duration-200 ease-in-out"
          onClick={toggleOpen}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-normal font-medium">{question}</h3>
            <div className={`transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
              {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: answer }}></div>
          </div>
        </div>
      )
    }
  
    const FAQSection = () => {
      const [openIndex, setOpenIndex] = useState<number | null>(null)
      const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
      }
  
      return (
        <div className="faq-container grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <div className="flex items-center justify-center">
            <h2 className="mb-6 text-center text-2xl font-semibold p-8 md:p-12">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                toggleOpen={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      )
    }
}