"use client";

import { motion } from 'framer-motion';
import { Terminal, Key, Palette } from 'lucide-react';

export default function KeyBenefitsSection() {
  const benefits = [
    {
      title: "One-Line Install",
      description: "npm install aptus-ai-chatbot-widget — that's the whole setup. No servers, no SDKs to configure, no backend to host.",
      icon: Terminal,
      badgeBg: "bg-[#FF4D00]",
    },
    {
      title: "Token-Based Setup",
      description: "Register your business, grab your unique token, paste it into the component. Your chatbot is instantly connected to your trained data.",
      icon: Key,
      badgeBg: "bg-[#2D31FA]",
    },
    {
      title: "Fully Themeable",
      description: "Match your brand with built-in themes, custom colors, and flexible positioning — the widget adapts to your site, not the other way around.",
      icon: Palette,
      badgeBg: "bg-[#BFF000]",
    }
  ];

  return (
    <motion.div
      id="features"
      className="bg-[#FDF9F0] text-[#1a1a1a] py-16 px-6 sm:px-10 lg:px-20 border-b-3 border-[#1a1a1a] flex flex-col items-center gap-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Header Section */}
      <div className="text-center max-w-4xl">
        <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs px-3 py-1 uppercase tracking-widest inline-block mb-3">
          Built For Developers
        </span>
        <h2 className="font-syne text-[20px] sm:text-[28px] md:text-[32px] lg:text-[31px] xl:text-[36px] font-extrabold text-[#1a1a1a] uppercase mb-4 leading-tight tracking-tight">
          WHY DEVELOPERS CHOOSE <span className="underline decoration-[#FF4D00] decoration-4">APTUS AI</span>
        </h2>
        <p className="text-base sm:text-lg font-medium text-[#1a1a1a]">
          Designed from the ground up to be lightweight, developer-friendly, and instant to deploy.
        </p>
      </div>

      {/* Feature Icons Composite Banner (Single Cohesive Graphic Block) */}
      <div className="w-full max-w-xl bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-3">
        <img
          src="/feature-icons.png"
          alt="Aptus Feature Icon Set Banner"
          className="w-full h-auto object-contain border-2 border-[#1a1a1a]"
        />
      </div>

      {/* 3 Written Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="bg-white border-3 border-[#1a1a1a] shadow-neo p-8 flex flex-col items-start hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            <div className={`p-4 border-2 border-[#1a1a1a] shadow-neo-sm text-3xl mb-6 ${benefit.badgeBg}`}>
              <benefit.icon className={benefit.badgeBg === "bg-[#BFF000]" ? "text-[#1a1a1a] w-7 h-7" : "text-white w-7 h-7"} />
            </div>
            <h3 className="font-syne text-xl font-extrabold text-[#1a1a1a] uppercase mb-3">
              {benefit.title}
            </h3>
            <p className="text-base font-medium text-gray-800 leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
