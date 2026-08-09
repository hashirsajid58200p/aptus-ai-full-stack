"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const faqData = [
    {
      question: "Do I need to set up my own backend or server?",
      answer:
        "No. Aptus AI handles the AI models and data hosting — you just install the npm widget and connect it with your token.",
    },
    {
      question: "Which frameworks does the widget support?",
      answer:
        "React and Next.js today, with more framework support (Vue, Svelte, HTML vanilla) planned.",
    },
    {
      question: "How do I integrate Aptus AI into my website?",
      answer:
        "Run `npm install aptus-widget`, copy your API token from your Aptus AI owner dashboard, and import `<ChatBot token=\"YOUR_TOKEN\" />` into your app.",
    },
    {
      question: "How do I train the chatbot on my business data?",
      answer:
        "Sign up, add your business Q&As or FAQs in your dashboard, and Aptus AI automatically updates the chatbot's knowledge base in real time.",
    },
    {
      question: "Can I customize the look of the chat widget?",
      answer:
        "Yes! You can choose built-in theme presets or pass custom styling options to seamlessly match your website's branding.",
    },
  ];

  return (
    <section id="faq" className="bg-[#FDF9F0] py-16 px-6 border-b-3 border-[#1a1a1a] flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col items-center gap-10">
        {/* Title Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs px-3 py-1 uppercase tracking-widest inline-block mb-3">
            Developer FAQs
          </span>
          <h2 className="font-syne text-4xl sm:text-5xl font-extrabold text-[#1a1a1a] uppercase mb-3">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-gray-800 text-lg font-medium">
            Everything you need to know about embedding Aptus AI into your site.
          </p>
        </motion.div>

        {/* Accordion Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 sm:p-8"
        >
          <Accordion variant="splitted" className="gap-4">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                aria-label={item.question}
                title={
                  <span className="font-syne font-bold text-base sm:text-lg text-[#1a1a1a] uppercase">
                    {item.question}
                  </span>
                }
                className="bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm rounded-none px-4 py-2 font-medium text-[#1a1a1a]"
              >
                <div className="pt-2 text-gray-900 font-semibold leading-relaxed border-t border-[#1a1a1a]/20">
                  {item.answer}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
