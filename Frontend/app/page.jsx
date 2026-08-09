"use client";
import Hero from "@/components/hero";
import NavBar from "@/components/navbar";
import About from "@/components/about";
import Faq from "@/components/faq";
import Feature from "@/components/feature";
import ActionPreview from "@/components/action-preview";
import { ChatBot } from "quickstart-ai-chatbot-widget";
import { useEffect } from "react";
import { loadUser } from "@/slices/userSlice";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <main className="flex flex-col min-h-dvh bg-[#FDF9F0] text-[#1a1a1a]">
      <NavBar />
      <section id="hero">
        <Hero />
      </section>
      <section id="how-it-works">
        <About />
      </section>
      <section id="features">
        <Feature />
      </section>
      <section id="action-preview">
        <ActionPreview />
      </section>
      <section id="faq">
        <Faq />
      </section>

      {/* Neo-brutalist Footer */}
      <footer className="bg-white border-t-3 border-[#1a1a1a] py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/aptus-logo.png"
              alt="Aptus Logo"
              className="h-9 w-9 object-contain"
            />
            <span className="font-syne font-extrabold text-2xl uppercase tracking-tight text-[#1a1a1a]">
              APTUS
            </span>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1a1a1a]">
            © {new Date().getFullYear()} APTUS — DROP-IN NPM CHATBOT WIDGET. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      <ChatBot 
        token="A1ED-7127544F-1EBAF3E7" 
        apiUrl={process.env.NEXT_PUBLIC_API_URL || "https://quick-start-ai-backend.vercel.app/api/v1"}
        theme="secondary"
        wantToShowSuggestions={true}
      />
    </main>
  );
}
