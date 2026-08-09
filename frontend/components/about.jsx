"use client";

import { motion } from "framer-motion";
import { Terminal, CheckCircle2, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div id="how-it-works" className="py-16 bg-white border-b-3 border-[#1a1a1a]">
      <section className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side: Graphic Block */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full"
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
          className="flex-1 space-y-6"
        >
          <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs px-3 py-1 uppercase tracking-widest inline-block">
            3-Step Integration
          </span>

          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] uppercase leading-tight">
            TRAIN ON DASHBOARD. <br />
            <span className="text-[#2D31FA]">PASTE ONE LINE.</span>
          </h2>

          <p className="text-lg text-[#1a1a1a] font-medium leading-relaxed">
            Aptus AI lets any business train a custom AI assistant on their own business details and FAQs in seconds. The dashboard manages the AI intelligence while the lightweight <code className="bg-[#FDF9F0] border border-[#1a1a1a] px-2 py-0.5 font-mono text-sm font-bold">aptus-widget</code> handles the chat UI — zero servers to configure or host.
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
                  <code>npm install aptus-widget</code>
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

          <div className="pt-2">
            <button
              onClick={() => window.location.href = "/start"}
              className="btn-neo-primary px-8 py-3 rounded-none text-base flex items-center gap-2"
            >
              CREATE YOUR CHATBOT NOW
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
