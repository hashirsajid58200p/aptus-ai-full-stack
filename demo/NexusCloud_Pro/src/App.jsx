import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function App() {
  const apiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3100/api/v1'
    : `${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1`;

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
        apiUrl={apiUrl}
        wantToShowSuggestions={true}
      />
    </div>
  );
}
