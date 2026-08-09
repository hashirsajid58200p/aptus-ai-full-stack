"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const faqData = [
    {
      question: "What is QuickStart AI?",
      answer:
        "QuickStart AI is an AI-powered chat solution that allows businesses to offer instant, real-time customer support by integrating a simple npm package into their website.",
    },
    {
      question: "How do I integrate QuickStart AI into my website?",
      answer:
        "Once you sign up and add your business, you’ll receive an npm package that you can install into your website. Configure it via your personalized dashboard to match your business needs.",
    },
    {
      question: "Will QuickStart AI slow down my website?",
      answer:
        "No! QuickStart AI is built to be lightweight, ensuring that your website maintains optimal speed and performance.",
    },
    {
      question: "How secure is the chat data?",
      answer:
        "We prioritize security, ensuring that all chat data is securely stored and protected by industry-standard security protocols.",
    },
    {
      question: "Can I customize the look of the chat widget?",
      answer:
        "Yes, you can fully customize the chat widget to match your website’s branding and style, ensuring a seamless user experience for your customers.",
    },
  ];

  return (
    <section className="relative max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center text-[black] 
    w-full md:w-[50%] sm:w-[100%]
    ">
      {/* Title Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex flex-col gap-3 justify-center items-center bg-white"
      >
        <h4 className="text-3xl font-bold sm:text-4xl bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 bg-clip-text text-transparent">
          FAQ
        </h4>
        <p className="max-w-xl text-gray-500 text-center">
          Here are some of our frequently asked questions. If you have any other
          questions, feel free to email us.
        </p>
      </motion.div>

      {/* Accordion Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
        className="max-w-2xl w-full border border-gray-300 rounded-md p-4 bg-gradient-to-b from-purple-100 to-indigo-100 shadow-lg"
      >
        <Accordion
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                height: "auto",
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 1,
                  },
                },
              },
              exit: {
                y: -10,
                opacity: 0,
                height: 0,
                transition: {
                  height: {
                    easings: "ease",
                    duration: 0.25,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 0.3,
                  },
                },
              },
            },
          }}
        >
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              aria-label={item.question}
              title={item.question}
              className=" w-[100%]" 
            >
              <div className=" w-[100%]  items-center ">
                {item.answer}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
