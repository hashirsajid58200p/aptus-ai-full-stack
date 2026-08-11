"use client";
import React, { useState } from 'react';
import { Button } from "components/ui/button";
import { ArrowRight, Code, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopyNpm = () => {
    navigator.clipboard.writeText("npm install aptus-ai-chatbot-widget");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-[#FDF9F0] border-b-3 border-[#1a1a1a] py-[64px] md:py-[88px] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left Side */}
        <motion.div variants={staggerContainer} className="lg:w-1/2 space-y-4">
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm px-[14px] py-[6px] text-[13px] font-black uppercase tracking-wider text-[#1a1a1a]"
          >
            <Code className="w-4 h-4" /> npm install aptus-ai-chatbot-widget
            <button
              type="button"
              onClick={handleCopyNpm}
              className="ml-1 hover:opacity-70 transition flex items-center focus:outline-none"
              title="Copy install command"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#1a1a1a]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-syne text-[20px] sm:text-[28px] md:text-[32px] lg:text-[31px] xl:text-[37px] font-extrabold text-[#1a1a1a] uppercase leading-tight tracking-tight space-y-[4px]"
          >
            <span className="block whitespace-nowrap">INSTALL PACKAGE.</span>
            <motion.span
              variants={fadeInUp}
              className="text-[#FF4D00] block whitespace-nowrap"
            >
              EMBED TOKEN.
            </motion.span>
            <span className="block whitespace-nowrap">GO LIVE.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-[17px] md:text-[19px] text-[#1a1a1a] font-medium leading-relaxed max-w-[530px]"
          >
            Aptus AI turns your business FAQs into a live, on-brand chatbot widget. Install the package, paste your token, and you're done — no backend to host, no complex setup, no code to maintain.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
            <Button
              onClick={() => window.location.href = "/start"}
              className="btn-neo-primary text-[15px] sm:text-[17px] px-[26px] py-[13px] rounded-none flex items-center gap-2.5"
            >
              GET YOUR TOKEN
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              onClick={() => window.location.href = "/docs"}
              className="btn-neo text-[15px] sm:text-[17px] px-[26px] py-[13px] rounded-none flex items-center gap-2.5"
            >
              VIEW DOCS
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Side with Hero Illustration */}
        <motion.div variants={fadeInUp} className="lg:w-1/2 flex justify-center relative">
          <div className="relative p-3 bg-white border-3 border-[#1a1a1a] shadow-neo-lg max-w-[520px]">
            {/* Sticker Badge Decorative Accent */}
            <motion.div
              initial={{ rotate: -8, scale: 0.9 }}
              animate={{ rotate: [-8, 2, -8] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
              className="absolute -top-6 -right-6 z-20 w-28 sm:w-36 pointer-events-none border-2 border-[#1a1a1a] shadow-neo-sm bg-white p-1"
            >
              <img
                src="/sticker-badges.png"
                alt="Decorative Sticker Badge"
                className="w-full h-auto object-contain"
              />
            </motion.div>

            <img
              src="/hero-illustration.png"
              alt="Aptus Chatbot Widget Illustration"
              className="w-full h-auto object-cover border-2 border-[#1a1a1a]"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
