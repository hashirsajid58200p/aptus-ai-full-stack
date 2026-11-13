"use client";

import { motion } from 'framer-motion';
import { Terminal, Cpu, Headphones, Mic, ShieldCheck, Sparkles } from 'lucide-react';

export default function KeyBenefitsSection() {
  const benefits = [
    {
      title: "One-Line Install",
      description: "npm install aptus-ai-chatbot-widget or paste our lightweight script tag. Works with any React, Next.js, or HTML site.",
      icon: Terminal,
      badgeBg: "bg-[#FF4D00]",
    },
    {
      title: "11+ Providers & Custom APIs",
      description: "Choose ultra-fast Groq LPU inference, OpenAI GPT-4o, Google Gemini, DeepSeek, Claude, or your own self-hosted / Ollama API.",
      icon: Cpu,
      badgeBg: "bg-[#2D31FA]",
    },
    {
      title: "Zero Hallucinations",
      description: "Replies are strictly grounded in your verified FAQs and Markdown documentation. It never fabricates prices, rates, or fake claims.",
      icon: Sparkles,
      badgeBg: "bg-[#BFF000]",
    },
    {
      title: "Live Human Takeover",
      description: "Support agents can take over conversations live from the dashboard, pausing AI replies and messaging visitors directly.",
      icon: Headphones,
      badgeBg: "bg-[#FF4D00]",
    },
    {
      title: "Real-Time Voice AI",
      description: "Instant speech-to-text powered by browser Web Speech streaming with Whisper Large v3 Turbo server-side fallback.",
      icon: Mic,
      badgeBg: "bg-[#2D31FA]",
    },
    {
      title: "Origin Security",
      description: "Domain whitelisting protects your API token from unauthorized external hotlinking and automated scrapers.",
      icon: ShieldCheck,
      badgeBg: "bg-[#BFF000]",
    },
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
          Built For Modern Teams
        </span>
        <h2 className="font-syne text-[20px] sm:text-[28px] md:text-[32px] lg:text-[31px] xl:text-[36px] font-extrabold text-[#1a1a1a] uppercase mb-4 leading-tight tracking-tight">
          ENTERPRISE-GRADE <span className="text-[#FF4D00]">CAPABILITIES</span>
        </h2>
        <p className="text-base sm:text-lg font-medium text-[#1a1a1a]">
          Designed from the ground up to be lightweight, developer-friendly, and instant to deploy.
        </p>
      </div>

      {/* 6 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="bg-white border-3 border-[#1a1a1a] shadow-neo p-6 sm:p-7 flex flex-col items-start hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className={`p-3.5 border-2 border-[#1a1a1a] shadow-neo-sm text-2xl mb-5 ${benefit.badgeBg}`}>
              <benefit.icon className={benefit.badgeBg === "bg-[#BFF000]" ? "text-[#1a1a1a] w-6 h-6" : "text-white w-6 h-6"} />
            </div>
            <h3 className="font-syne text-lg font-extrabold text-[#1a1a1a] uppercase mb-2">
              {benefit.title}
            </h3>
            <p className="text-sm font-medium text-gray-700 leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
