import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />

      {/* Aptus AI Chatbot Floating Widget configured with NexusCloud API Token */}
      <ChatBot
        token="A1ED-CD70379B-E72B6C6D"
        apiUrl="https://aptus-ai-full-stack.vercel.app/api/v1"
        theme="dracula"
        wantToShowSuggestions={true}
      />
    </div>
  );
}
