"use client";

import { motion } from "framer-motion";
import { Terminal, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div id="how-it-works" className="py-16 bg-white border-b-3 border-[#1a1a1a]">
      <section className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        {/* Left Side: Graphic Block */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full max-w-[490px] mx-auto"
        >
          <div className="bg-[#2D31FA] p-3 border-3 border-[#1a1a1a] shadow-neo-lg transform -rotate-1">
            <div className="bg-white border-2 border-[#1a1a1a] p-2">
              <img
                src="/how-it-works.png"
                alt="How Aptus Works"
                className="w-full h-auto object-cover border border-[#1a1a1a]"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Side: Text & Code Instructions */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 space-y-4"
        >
          <span className="inline-flex items-center gap-2 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm px-[14px] py-[6px] text-[13px] font-black uppercase tracking-wider">
            3-Step Integration
          </span>

          <h2 className="font-syne text-[20px] sm:text-[28px] md:text-[32px] lg:text-[31px] xl:text-[36px] font-extrabold uppercase leading-tight tracking-tight whitespace-nowrap flex items-center gap-2 sm:gap-3">
            <span className="text-[#FF4D00]">TRAIN</span>
            <span className="text-[#1a1a1a]">➔</span>
            <span className="text-[#2D31FA]">INSTALL</span>
            <span className="text-[#1a1a1a]">➔</span>
            <span className="text-[#16A34A]">EMBED</span>
          </h2>

          <p className="text-[17px] md:text-[19px] text-[#1a1a1a] font-medium leading-relaxed max-w-[575px]">
            Aptus AI lets any business train a custom AI assistant on their own business details and FAQs in seconds. The dashboard manages the AI intelligence while the lightweight <code className="bg-[#FDF9F0] border border-[#1a1a1a] px-2 py-0.5 font-mono text-sm font-bold">aptus-ai-chatbot-widget</code> handles the chat UI — zero servers to configure or host.
          </p>

          {/* 3-Step Setup */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-4 p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
              <span className="bg-[#FF4D00] text-white font-extrabold text-sm w-7 h-7 flex items-center justify-center border border-[#1a1a1a]">1</span>
              <div>
                <h4 className="font-syne font-bold text-base uppercase text-[#1a1a1a]">Train Your Chatbot</h4>
                <p className="text-sm font-medium text-gray-700">Add your business FAQs in the Aptus AI Dashboard to build custom AI knowledge.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
              <span className="bg-[#2D31FA] text-white font-extrabold text-sm w-7 h-7 flex items-center justify-center border border-[#1a1a1a]">2</span>
              <div>
                <h4 className="font-syne font-bold text-base uppercase text-[#1a1a1a]">Install NPM Package</h4>
                <div className="mt-1 bg-[#1a1a1a] text-[#BFF000] font-mono text-xs p-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-white" />
                  <code>npm install aptus-ai-chatbot-widget</code>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
              <span className="bg-[#BFF000] text-[#1a1a1a] font-extrabold text-sm w-7 h-7 flex items-center justify-center border border-[#1a1a1a]">3</span>
              <div>
                <h4 className="font-syne font-bold text-base uppercase text-[#1a1a1a]">Embed & Launch</h4>
                <p className="text-sm font-medium text-gray-700">Paste your API token into the component and your chatbot is instantly live!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
