"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Terminal,
  Code,
  Palette,
  Settings,
  Check,
  Copy,
  Cpu,
  Headphones,
  Mic,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import baseurl from "@/store/baseurl";

export default function DocsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("intro");
  const [copiedNpm, setCopiedNpm] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);

  useEffect(() => {
    document.title = "Documentation — Aptus AI";
  }, []);

  const reactUsageCode = `import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Drop the widget anywhere in your layout */}
        <ChatBot 
          token="YOUR_BUSINESS_TOKEN"
          apiUrl="${baseurl}"
          theme="aptus"
          position="right"
          wantToShowSuggestions={true}
        />
      </body>
    </html>
  );
}`;

  const scriptUsageCode = `<!-- Paste before the closing </body> tag of any HTML page -->
<script
  src="https://unpkg.com/aptus-ai-chatbot-widget@latest/dist/index.js"
  data-token="YOUR_BUSINESS_TOKEN"
  data-api-url="${baseurl}"
  defer>
</script>`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "npm") {
      setCopiedNpm(true);
      setTimeout(() => setCopiedNpm(false), 2000);
    } else if (type === "script") {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else if (type === "usage") {
      setCopiedUsage(true);
      setTimeout(() => setCopiedUsage(false), 2000);
    }
  };

  const sections = [
    { id: "intro", label: "Overview", icon: BookOpen },
    { id: "install", label: "Installation", icon: Terminal },
    { id: "usage", label: "Quick Start", icon: Code },
    { id: "props", label: "Props API", icon: Settings },
    { id: "features", label: "Core Engine", icon: Cpu },
    { id: "themes", label: "Theming", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1a1a1a] font-inter pb-12">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FDF9F0] border-b-3 border-[#1a1a1a] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-neo-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all uppercase text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Back</span>
          </button>
          <div className="h-5 w-0.5 bg-[#1a1a1a]/20 mx-1"></div>
          <h1 className="font-syne text-base md:text-lg font-extrabold uppercase tracking-tight">
            Aptus AI <span className="text-[#FF4D00]">Documentation</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.npmjs.com/package/aptus-ai-chatbot-widget"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            npm v1.0.11
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 mt-2">
        {/* Sidebar */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="bg-white border-3 border-[#1a1a1a] p-3 shadow-neo-sm md:sticky md:top-24 flex flex-col gap-1.5">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 font-bold text-xs uppercase border-2 transition-all cursor-pointer ${
                  activeTab === sec.id
                    ? "bg-[#FF4D00] text-white border-[#1a1a1a] shadow-neo-sm"
                    : "bg-[#FDF9F0] text-[#1a1a1a] border-transparent hover:border-[#1a1a1a]"
                }`}
              >
                <sec.icon className="w-4 h-4 shrink-0" />
                <span>{sec.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border-3 border-[#1a1a1a] p-5 md:p-8 shadow-neo-lg min-h-[500px]">
          {/* Overview */}
          {activeTab === "intro" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                  Platform Overview
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2 leading-relaxed">
                  Aptus AI is a conversational customer support automation platform. It turns your business knowledge base, FAQs, and documentation into a live, on-brand chatbot widget with zero hallucinations and sub-second inference speeds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <span className="font-black text-xs uppercase text-[#FF4D00] block mb-1">
                    Zero Hallucination Grounding
                  </span>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Chatbot replies are strictly grounded in your verified FAQs and Markdown documentation. It never invents fake prices or rates.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <span className="font-black text-xs uppercase text-[#1a1a1a] block mb-1">
                    11 AI Inference Providers
                  </span>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Connect directly to Groq (Llama 3.3 70B), OpenAI GPT-4o, Google Gemini, DeepSeek, Claude 3.5, Mistral, Perplexity, or Custom APIs.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <span className="font-black text-xs uppercase text-[#1a1a1a] block mb-1">
                    Live Human Agent Takeover
                  </span>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Take over live chats instantly from the business dashboard with direct agent replies and real-time widget polling.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <span className="font-black text-xs uppercase text-[#FF4D00] block mb-1">
                    Real-Time Voice AI (STT)
                  </span>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Live speech-to-text powered by browser Web Speech streaming paired with Groq Whisper Large v3 Turbo server-side fallback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Installation */}
          {activeTab === "install" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                  Installation
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                  Install via npm for modern React/Next.js stacks, or drop the compiled script tag onto any website.
                </p>
              </div>

              {/* NPM / Yarn */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-[#1a1a1a]">Option 1: NPM Package (React / Next.js)</span>
                <div className="bg-[#1a1a1a] p-4 border-2 border-[#1a1a1a] relative shadow-neo-sm">
                  <pre className="text-[#BFF000] font-mono text-xs overflow-x-auto pr-10">
                    <code>npm install aptus-ai-chatbot-widget</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard("npm install aptus-ai-chatbot-widget", "npm")}
                    className="absolute top-2.5 right-2.5 bg-white p-1.5 border border-[#1a1a1a] hover:bg-[#BFF000] transition-colors cursor-pointer"
                  >
                    {copiedNpm ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                  </button>
                </div>
              </div>

              {/* Script Tag */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-[#1a1a1a]">Option 2: Standalone Script Tag (HTML, WordPress, Shopify)</span>
                <div className="bg-[#1a1a1a] p-4 border-2 border-[#1a1a1a] relative shadow-neo-sm">
                  <pre className="text-white font-mono text-xs overflow-x-auto pr-10 whitespace-pre-wrap">
                    <code>{scriptUsageCode}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(scriptUsageCode, "script")}
                    className="absolute top-2.5 right-2.5 bg-white p-1.5 border border-[#1a1a1a] hover:bg-[#BFF000] transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Start */}
          {activeTab === "usage" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                  Quick Start (React / Next.js)
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                  Import the widget into your application root and provide your unique token from the dashboard.
                </p>
              </div>

              <div className="bg-[#1a1a1a] border-2 border-[#1a1a1a] relative shadow-neo-sm">
                <div className="bg-[#FAF8F5] border-b-2 border-[#1a1a1a] px-3 py-2 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-600">layout.jsx</span>
                  <button
                    onClick={() => copyToClipboard(reactUsageCode, "usage")}
                    className="px-2.5 py-1 bg-white border border-[#1a1a1a] text-xs font-bold uppercase hover:bg-[#BFF000] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedUsage ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUsage ? "Copied" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
                  <code>{reactUsageCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Props API */}
          {activeTab === "props" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                  Props API Reference
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                  Available properties for configuring the ChatBot component:
                </p>
              </div>

              <div className="overflow-x-auto border-2 border-[#1a1a1a]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-white font-mono uppercase tracking-wider text-[11px]">
                      <th className="p-2.5 border-b-2 border-[#1a1a1a]">Prop</th>
                      <th className="p-2.5 border-b-2 border-[#1a1a1a]">Type</th>
                      <th className="p-2.5 border-b-2 border-[#1a1a1a]">Default</th>
                      <th className="p-2.5 border-b-2 border-[#1a1a1a]">Description</th>
                    </tr>
                  </thead>
                  <tbody className="font-medium divide-y divide-gray-200">
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#FF4D00]">token *</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 text-gray-400">-</td>
                      <td className="p-2.5">Your unique business token generated in the dashboard.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#FF4D00]">apiUrl *</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 text-gray-400">-</td>
                      <td className="p-2.5">Base URL of your Aptus AI backend instance.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">theme</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 font-mono">"aptus"</td>
                      <td className="p-2.5">Visual theme ("aptus", "boty", "chatgpt", "compute").</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">position</td>
                      <td className="p-2.5 font-mono text-gray-600">"left" | "right"</td>
                      <td className="p-2.5 font-mono">"right"</td>
                      <td className="p-2.5">Screen positioning for the floating trigger button.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">botName</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 font-mono">"Aptus AI"</td>
                      <td className="p-2.5">Custom display name shown in the chat header.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">welcomeMessage</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 text-gray-500">Default greeting</td>
                      <td className="p-2.5">Initial message presented when the chat opens.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">wantToShowSuggestions</td>
                      <td className="p-2.5 font-mono text-gray-600">boolean</td>
                      <td className="p-2.5 font-mono">false</td>
                      <td className="p-2.5">Displays interactive suggestion chips below bot messages.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Core Engine */}
          {activeTab === "features" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                  Core Engine & Features
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                  Built-in capabilities that power every Aptus AI installation:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-[#FF4D00]" />
                    <span>Knowledge Ingestion & Gate</span>
                  </h3>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    The chatbot activates once your business provides at least 10 FAQs or 1,000 words of Markdown documentation (up to 5,000 words maximum). This ensures the AI is grounded before serving live visitors.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] flex items-center gap-2 mb-1">
                    <Headphones className="w-4 h-4 text-[#2563EB]" />
                    <span>Live Human Takeover</span>
                  </h3>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Business owners can click "Take Over Chat" on any session in the dashboard. Incoming AI auto-replies pause, and the agent types live responses delivered to the visitor via real-time polling.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] flex items-center gap-2 mb-1">
                    <Mic className="w-4 h-4 text-[#FF4D00]" />
                    <span>Real-Time Voice AI</span>
                  </h3>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Streaming speech-to-text uses the browser's native Web Speech API with interim results for instant transcription, falling back to Groq Whisper Large v3 Turbo if speech APIs are unavailable.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Domain Whitelisting & Origin Security</span>
                  </h3>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Specify an Allowed Domain in the dashboard to protect your token allowance from unauthorized hotlinking. Unmatched origins receive HTTP 403 Forbidden automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Theming */}
          {activeTab === "themes" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                  Design Themes
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                  Pass the theme prop to apply a complete aesthetic out of the box:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "aptus", name: "Aptus Official", desc: "Signature neo-brutalist theme with bold 3px black borders and orange accents.", color: "bg-[#FF4D00]" },
                  { id: "boty", name: "Boty Organic", desc: "Earthy nature-inspired green palette with soft, minimal styling.", color: "bg-[#2D5A27]" },
                  { id: "chatgpt", name: "ChatGPT Dark", desc: "Sleek charcoal dark mode designed for modern software applications.", color: "bg-[#202123]" },
                  { id: "compute", name: "Retro CRT Terminal", desc: "High-contrast monospace cyber-terminal aesthetic.", color: "bg-[#1a1a1a]" },
                ].map((t) => (
                  <div key={t.id} className="p-4 bg-white border-2 border-[#1a1a1a] shadow-neo-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-syne font-black text-xs uppercase text-[#1a1a1a]">{t.name}</span>
                      <span className={`w-3.5 h-3.5 border border-[#1a1a1a] ${t.color}`}></span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-2">{t.desc}</p>
                    <code className="text-[11px] font-mono font-bold text-[#FF4D00]">theme="{t.id}"</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
