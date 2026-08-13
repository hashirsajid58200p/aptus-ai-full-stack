import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 selection:bg-emerald-500 selection:text-white relative">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />

      {/* Aptus AI Chatbot Floating Widget configured with VeloVita API Token */}
      <ChatBot
        token="A1ED-EEB2866D-48C86113"
        apiUrl="https://aptus-ai-full-stack.vercel.app/api/v1"
        theme="chatgpt"
        wantToShowSuggestions={true}
      />
    </div>
  );
}
