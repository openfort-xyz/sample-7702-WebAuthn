import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const faqData = [
  {
    question: 'What is a passkey wallet?',
    answer: 'A passkey wallet lets you log in and use your wallet without passwords or seed phrases. It uses your device\'s built-in security (like Face ID, Touch ID, or a hardware key) to keep your assets safe and easy to access.',
  },
  {
    question: 'How is this different from a regular crypto wallet?',
    answer: 'Traditional wallets often ask you to store seed phrases or private keys, which can be confusing and risky. Passkey wallets remove that hassle while keeping the same security, sometimes even stronger.',
  },
  {
    question: 'Can I still use my wallet across multiple devices?',
    answer: 'Yes. With passkeys, you can connect your wallet to different devices as long as you use the same account (like Apple, Google, or another identity provider). It\'s secure and syncs easily.',
  },
  {
    question: 'Is a passkey wallet safe for developers to integrate?',
    answer: 'Absolutely. Passkey wallets follow industry security standards and reduce the risk of user mistakes (like losing a seed phrase). platforms like&nbsp;Openfort&nbsp;make it even easier for developers to add passkey-based wallets directly into apps and games.',
  },
  {
    question: 'Do I need to download an app to use it?',
    answer: 'Not always. Many passkey wallets work directly in your browser or inside the app you\'re using. With Openfort, for example, users don\'t need a separate app, wallets are embedded right into the experience.',
  },
  {
    question: 'Can I use a passkey wallet for stablecoins and payments?',
    answer: 'Yes. You can hold, send, and receive stablecoins just like with any other wallet. This makes passkey wallets great for simple payments and everyday transactions.',
  },
];

export const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  toggleOpen 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  toggleOpen: () => void 
}) => {
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
        <div className="text-gray-200" dangerouslySetInnerHTML={{ __html: answer }}></div>
      </div>
    </div>
  );
};

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="flex items-center justify-center">
        <h2 className="mb-6 text-center text-2xl font-semibold p-8 md:p-12">
          Frequently asked questions
        </h2>
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
  );
};