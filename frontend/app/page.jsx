"use client";

import Hero from "@/components/hero";
import NavBar from "@/components/navbar";
import HowItWorks from "@/components/how-it-works";
import Faq from "@/components/faq";
import Feature from "@/components/feature";
import ActionPreview from "@/components/action-preview";
import { useEffect, useState } from "react";
import { loadUser } from "@/slices/userSlice";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import baseurl from "@/store/baseurl";

const ChatBotWidget = dynamic(
  () => import("aptus-ai-chatbot-widget").then((mod) => mod.ChatBot),
  { ssr: false }
);

export default function Home() {
  const dispatch = useDispatch();
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    dispatch(loadUser());
    setCurrentYear(new Date().getFullYear());
  }, [dispatch]);

  return (
    <main className="flex flex-col min-h-dvh bg-[#FDF9F0] text-[#1a1a1a] overflow-x-hidden w-full">
      <NavBar />
      <section id="hero">
        <Hero />
      </section>
      <section id="how-it-works" className="scroll-mt-[83px]">
        <HowItWorks />
      </section>
      <section id="features" className="scroll-mt-[83px]">
        <Feature />
      </section>
      <section id="action-preview" className="scroll-mt-[83px]">
        <ActionPreview />
      </section>
      <section id="faq" className="scroll-mt-[83px]">
        <Faq />
      </section>

      {/* Live npm package ChatBot widget integration */}
      <ChatBotWidget
        token="A1ED-AC9D6DEE-46A3DFD8"
        apiUrl={baseurl}
        theme="aptus"
        wantToShowSuggestions={true}
      />

      {/* Neo-brutalist Footer */}
      <footer className="bg-white border-t-3 border-[#1a1a1a] py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <img
              src="/aptus-logo.png"
              alt="Aptus"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1a1a1a]">
            © {currentYear} APTUS AI — NPM CHATBOT WIDGET. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </main>
  );
}
