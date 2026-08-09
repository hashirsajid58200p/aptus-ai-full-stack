"use client";
import React from 'react';
import { Button } from "components/ui/button";
import { ArrowRight, Code } from 'lucide-react';
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
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-[#FDF9F0] border-b-3 border-[#1a1a1a] py-12 md:py-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left Side */}
        <motion.div variants={staggerContainer} className="lg:w-1/2 space-y-6">
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1a1a1a]"
          >
            <Code className="w-4 h-4" /> npm install aptus-ai-chatbot-widget
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-syne text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#1a1a1a] uppercase leading-none tracking-tight"
          >
            PLUG IN.{" "}
            <motion.span
              variants={fadeInUp}
              className="font-playfair italic text-[#FF4D00] font-bold normal-case inline-block"
            >
              GO LIVE.
            </motion.span>{" "}
            <br />
            THAT'S IT.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-[#1a1a1a] font-medium leading-relaxed max-w-xl"
          >
            Aptus AI is a drop-in AI chatbot widget for your website. Install the npm package, paste your token, and you're live — no backend to host, no complex setup, no waiting around.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
            <Button
              onClick={() => window.location.href = "/start"}
              className="btn-neo-primary text-base sm:text-lg px-8 py-4 rounded-none flex items-center gap-3"
            >
              GET YOUR TOKEN
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              onClick={() => window.location.href = "#how-it-works"}
              className="btn-neo text-base sm:text-lg px-8 py-4 rounded-none flex items-center gap-2"
            >
              VIEW DOCS
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Side with Hero Illustration */}
        <motion.div variants={fadeInUp} className="lg:w-1/2 flex justify-center relative">
          <div className="relative p-3 bg-white border-3 border-[#1a1a1a] shadow-neo-lg max-w-lg">
            {/* Sticker Badge Decorative Accent */}
            <motion.div
              initial={{ rotate: -8, scale: 0.9 }}
              animate={{ rotate: [-8, 2, -8] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
              className="absolute -top-6 -right-6 z-20 w-28 sm:w-36 pointer-events-none drop-shadow-md"
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
