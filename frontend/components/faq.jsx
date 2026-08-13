"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const faqData = [
    {
      question: "Do I need to set up or host my own backend?",
      answer:
        "No. Aptus AI handles all AI server infrastructure, database storage, and Groq Llama 3.3 model inference. You only install the aptus-ai-chatbot-widget npm package and pass your API token.",
    },
    {
      question: "Which frameworks are supported by the widget?",
      answer:
        "The aptus-ai-chatbot-widget package natively supports React 17+ and Next.js (both App Router and Pages Router).",
    },
    {
      question: "How do I train the chatbot on my business data?",
      answer:
        "Simply create an account, navigate to your dashboard, and add your business description and custom Q&As. Your chatbot automatically learns from your inputs in real time without requiring any code redeployments.",
    },
    {
      question: "Is the chatbot widget customizable to match my website design?",
      answer:
        "Yes! You can choose built-in theme presets like 'aptus', enable or disable quick-reply question suggestions, and configure widget positioning to seamlessly fit your brand aesthetics.",
    },
    {
      question: "How does token authorization and usage tracking work?",
      answer:
        "Each registered account generates a unique business token (e.g. A1ED-BACD7C30...). The widget passes this token to fetch your specific business intelligence while your owner dashboard tracks session analytics in real time.",
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
          <h2 className="font-syne text-[20px] sm:text-[28px] md:text-[32px] lg:text-[31px] xl:text-[36px] font-extrabold text-[#1a1a1a] uppercase mb-3 leading-tight tracking-tight">
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
                  <span className="font-syne font-bold text-sm sm:text-base md:text-lg text-[#1a1a1a] uppercase whitespace-normal break-words text-left block">
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
