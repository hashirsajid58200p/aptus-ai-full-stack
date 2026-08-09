"use client";

import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

export default function ActionPreview() {
  return (
    <section id="action-preview" className="bg-white py-16 px-6 border-b-3 border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <span className="bg-[#2D31FA] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs px-3 py-1 uppercase tracking-widest inline-block">
            See It In Action
          </span>

          <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] uppercase leading-tight">
            SEAMLESS EXPERIENCE <br />
            <span className="text-[#FF4D00]">ON ANY SCREEN</span>
          </h2>

          <p className="text-lg text-[#1a1a1a] font-medium leading-relaxed">
            Once installed, the Aptus AI widget blends into your web application layout smoothly. It provides your visitors with an instant AI support interface while sending analytics and training feedback straight back to your owner dashboard.
          </p>

          <div className="space-y-3 font-bold text-sm text-[#1a1a1a]">
            <div className="flex items-center gap-3 p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
              <Check className="w-5 h-5 text-[#FF4D00] stroke-[3]" />
              <span>Lightweight package under 100KB — zero page slowdown</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
              <Check className="w-5 h-5 text-[#2D31FA] stroke-[3]" />
              <span>Responsive overlay with dark & light theme modes</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
              <Check className="w-5 h-5 text-[#BFF000] stroke-[3]" />
              <span>Real-time training updates without redeploying code</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Mockup Graphic Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full"
        >
          <div className="bg-[#FDF9F0] p-4 border-3 border-[#1a1a1a] shadow-neo-lg relative">
            <div className="absolute -top-3 -left-3 bg-[#FF4D00] text-white font-extrabold text-xs px-3 py-1 border-2 border-[#1a1a1a] shadow-neo-sm uppercase flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Widget & Dashboard Preview
            </div>
            <img
              src="/dashboard-mockup.png"
              alt="Aptus Product Dashboard & Widget Mockup"
              className="w-full h-auto object-cover border-2 border-[#1a1a1a] mt-2 bg-white"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
