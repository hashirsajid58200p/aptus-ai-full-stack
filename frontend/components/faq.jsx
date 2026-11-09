"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const faqData = [
    {
      question: "Do I need to set up or host my own backend?",
      answer:
        "No. Aptus AI handles all AI server infrastructure, database storage, and multi-model inference. You simply install the aptus-ai-chatbot-widget package (or paste the script tag) and pass your unique API token.",
    },
    {
      question: "Which LLM models and inference providers can I use?",
      answer:
        "Aptus AI connects to 11 leading AI providers: Groq (ultra-fast LPU inference), OpenAI (GPT-4o), Google Gemini, DeepSeek (V3/R1), Anthropic Claude, Mistral, Perplexity, Cohere, xAI Grok, OpenRouter, and custom OpenAI-compatible endpoints.",
    },
    {
      question: "How do I train the chatbot to prevent false answers and hallucinations?",
      answer:
        "In your dashboard, add structured FAQs or write/paste up to 5,000 words of comprehensive Markdown documentation. The chatbot activates once minimum knowledge criteria is met, answering strictly from your verified content without fabricating prices.",
    },
    {
      question: "Can human support agents take over live conversations?",
      answer:
        "Yes! Business owners can inspect live conversations in the Sessions inbox and click 'Take Over Chat' anytime. AI replies are paused, and direct agent replies stream to the customer's widget in real time.",
    },
    {
      question: "Does the widget support voice typing and speech-to-text?",
      answer:
        "Yes. Customers can speak naturally using real-time browser Web Speech streaming paired with Groq Whisper Large v3 Turbo server-side fallback, supporting English, Urdu, and Roman Urdu.",
    },
    {
      question: "How do I secure my token and prevent unauthorized hotlinking?",
      answer:
        "Configure your website's domain in the Token & Security tab. All widget requests from unauthorized external domains are automatically rejected with HTTP 403 Forbidden.",
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
