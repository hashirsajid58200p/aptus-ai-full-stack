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
  FileText,
  Key,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import baseurl from "@/store/baseurl";

export default function DocsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("intro");
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    document.title = "Setup Guide & Documentation — Aptus AI";
  }, []);

  const reactUsageCode = `import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Zero-Config: Themes, knowledge base, and model settings sync live from your Aptus AI dashboard */}
        <ChatBot 
          token="YOUR_BUSINESS_TOKEN"
          apiUrl="${baseurl}"
        />
      </body>
    </html>
  );
}`;

  const scriptUsageCode = `<!-- Paste before the closing </body> tag of any HTML/Shopify/Webflow/WordPress page -->
<script
  src="https://unpkg.com/aptus-ai-chatbot-widget@latest/dist/index.js"
  data-token="YOUR_BUSINESS_TOKEN"
  data-api-url="${baseurl}"
  defer>
</script>`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sections = [
    { id: "intro", label: "Setup Overview", icon: BookOpen },
    { id: "install", label: "Installation", icon: Terminal },
    { id: "quickstart", label: "Quick Start", icon: Code },
    { id: "training", label: "Knowledge Base", icon: FileText },
    { id: "providers", label: "Model Providers", icon: Cpu },
    { id: "props", label: "Props API", icon: Settings },
    { id: "liveagent", label: "Live Support & Voice", icon: Headphones },
    { id: "themes", label: "Themes & Branding", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1a1a1a] font-inter pb-16">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FDF9F0] border-b-3 border-[#1a1a1a] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-neo-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all uppercase text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Back Home</span>
          </button>
          <div className="h-5 w-0.5 bg-[#1a1a1a]/20 mx-1"></div>
          <h1 className="font-syne text-base md:text-lg font-extrabold uppercase tracking-tight">
            Aptus AI <span className="text-[#FF4D00]">Setup Guide & Docs</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.npmjs.com/package/aptus-ai-chatbot-widget"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            npm v1.0.12
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 mt-2">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border-3 border-[#1a1a1a] p-3 shadow-neo-sm md:sticky md:top-24 flex flex-col gap-1.5">
            <div className="px-3 py-2 border-b-2 border-[#1a1a1a] mb-1">
              <span className="font-syne font-black text-[11px] uppercase tracking-wider text-gray-500">
                Documentation Index
              </span>
            </div>
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

        {/* Main Guide Content */}
        <main className="flex-1 bg-white border-3 border-[#1a1a1a] p-6 md:p-10 shadow-neo-lg min-h-[550px]">
          {/* TAB 1: Setup Overview */}
          {activeTab === "intro" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  Architecture & Flow
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  Platform Setup Overview
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2 leading-relaxed">
                  Aptus AI empowers modern companies to deploy grounded, responsive AI customer support agents in minutes. All model orchestration, prompt engineering, rate limiting, and real-time live human takeover run autonomously on Aptus AI cloud servers.
                </p>
              </div>

              {/* 3-Step Setup Process */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <div className="w-7 h-7 bg-[#FF4D00] text-white font-black text-sm flex items-center justify-center border border-[#1a1a1a] mb-3">
                    1
                  </div>
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] mb-1">
                    Generate Your Token
                  </h3>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    Log in to your Aptus AI dashboard, copy your business token from <strong>Token & Security</strong>, and whitelist your production domain.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <div className="w-7 h-7 bg-[#2D31FA] text-white font-black text-sm flex items-center justify-center border border-[#1a1a1a] mb-3">
                    2
                  </div>
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] mb-1">
                    Feed Knowledge Base
                  </h3>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    Provide at least 10 FAQs or 1,000 words of Markdown in <strong>Business Details</strong>. The chatbot activates automatically once grounded.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <div className="w-7 h-7 bg-[#BFF000] text-[#1a1a1a] font-black text-sm flex items-center justify-center border border-[#1a1a1a] mb-3">
                    3
                  </div>
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] mb-1">
                    Embed In Your Site
                  </h3>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    Install <code className="bg-white px-1 border border-[#1a1a1a] font-mono text-[11px]">aptus-ai-chatbot-widget</code> in your app root. All appearance themes sync automatically.
                  </p>
                </div>
              </div>

              {/* Core Architecture Highlights */}
              <div className="p-5 bg-[#FDF9F0] border-2 border-[#1a1a1a] mt-4">
                <h4 className="font-syne font-black text-xs uppercase text-[#1a1a1a] mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Zero Hallucination Guarantee</span>
                </h4>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  The Aptus AI reasoning engine enforces strict knowledge boundaries. If a visitor asks a question that is not covered in your business documentation or verified FAQs, the assistant politely declines rather than fabricating pricing, policies, or technical specifications.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Installation */}
          {activeTab === "install" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  Package Distribution
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  Installation
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                  Choose between the modern React package for Next.js/React applications or the standalone bundle for static HTML, Shopify, Webflow, and WordPress.
                </p>
              </div>

              {/* NPM / PNPM / Yarn */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-[#1a1a1a]">
                  Option 1: Modern Package Managers (React & Next.js)
                </h3>
                <div className="bg-[#1a1a1a] p-4 border-2 border-[#1a1a1a] relative shadow-neo-sm">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400">Terminal Shell</span>
                    <button
                      onClick={() => copyToClipboard("npm install aptus-ai-chatbot-widget", "npm")}
                      className="px-2 py-0.5 bg-white text-[#1a1a1a] border border-[#1a1a1a] text-[11px] font-extrabold uppercase hover:bg-[#BFF000] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "npm" ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "npm" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="text-[#BFF000] font-mono text-xs overflow-x-auto space-y-1">
                    <code># Using npm</code><br />
                    <code>npm install aptus-ai-chatbot-widget</code><br /><br />
                    <code># Using pnpm</code><br />
                    <code>pnpm add aptus-ai-chatbot-widget</code><br /><br />
                    <code># Using yarn</code><br />
                    <code>yarn add aptus-ai-chatbot-widget</code>
                  </pre>
                </div>
              </div>

              {/* Script Tag */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase text-[#1a1a1a]">
                  Option 2: Standalone Script Tag (HTML / CMS Platforms)
                </h3>
                <div className="bg-[#1a1a1a] p-4 border-2 border-[#1a1a1a] relative shadow-neo-sm">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-gray-400">HTML embed</span>
                    <button
                      onClick={() => copyToClipboard(scriptUsageCode, "script")}
                      className="px-2 py-0.5 bg-white text-[#1a1a1a] border border-[#1a1a1a] text-[11px] font-extrabold uppercase hover:bg-[#BFF000] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "script" ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "script" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="text-white font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    <code>{scriptUsageCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Quick Start */}
          {activeTab === "quickstart" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  Integration Guide
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  Quick Start (React / Next.js)
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                  Import the <code className="font-mono font-bold bg-[#FDF9F0] px-1 border border-[#1a1a1a]">ChatBot</code> component in your root layout. Appearance settings, avatar selection, colors, and welcome greetings automatically sync from your dashboard.
                </p>
              </div>

              <div className="bg-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm">
                <div className="bg-[#FAF8F5] border-b-2 border-[#1a1a1a] px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="font-mono text-xs font-bold text-gray-700 ml-2">app/layout.jsx</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(reactUsageCode, "usage")}
                    className="px-2.5 py-1 bg-white border border-[#1a1a1a] text-xs font-bold uppercase hover:bg-[#BFF000] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === "usage" ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === "usage" ? "Copied" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
                  <code>{reactUsageCode}</code>
                </pre>
              </div>

              <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] space-y-2">
                <h4 className="font-syne font-black text-xs uppercase text-[#1a1a1a]">
                  Zero-Config Remote Synchronization
                </h4>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  You do not need to hardcode bot names, primary colors, or theme names into your source code. When you change your chatbot avatar or theme preset in the Aptus AI Dashboard, your live widget immediately reflects the change on the next user visit without requiring a code commit or website redeploy.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Knowledge Base & Markdown Training */}
          {activeTab === "training" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  Knowledge Ingestion
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  Knowledge Base & Training
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2 leading-relaxed">
                  Aptus AI uses business-grounded retrieval to answer customer inquiries. You can train the assistant via structured Q&A pairs, rich Markdown documentation, or both simultaneously.
                </p>
              </div>

              {/* Minimum Knowledge Threshold Rule */}
              <div className="p-4 bg-white border-2 border-[#1a1a1a] shadow-neo-sm border-l-6 border-l-[#FF4D00]">
                <h4 className="font-syne font-black text-xs uppercase text-[#1a1a1a] mb-1">
                  Knowledge Gate Rule (Safety Lock)
                </h4>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  To prevent blank responses or hallucinations, the chatbot will remain in training standby until your business has provided either:
                </p>
                <ul className="list-disc list-inside text-xs font-bold text-[#1a1a1a] mt-1 space-y-0.5">
                  <li>At least 10 verified Question & Answer pairs, OR</li>
                  <li>A minimum of 1,000 words of Markdown documentation (up to 5,000 words maximum).</li>
                </ul>
              </div>

              {/* GitHub Flavored Markdown Formatting Guidelines */}
              <div className="space-y-3">
                <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a]">
                  Supported GitHub Flavored Markdown (GFM) Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FDF9F0] border border-[#1a1a1a]">
                    <span className="font-bold text-[#FF4D00] block mb-1">Headings & Formatting</span>
                    <p className="text-gray-700 font-medium">Headings (<code>#</code> to <code>######</code>), bold (<code>**bold**</code>), italics (<code>*italic*</code>), and strikethroughs are rendered with neo-brutalist typographic styling.</p>
                  </div>
                  <div className="p-3 bg-[#FDF9F0] border border-[#1a1a1a]">
                    <span className="font-bold text-[#2D31FA] block mb-1">Tables & Lists</span>
                    <p className="text-gray-700 font-medium">Multi-column Markdown tables, bulleted lists, numbered sequences, and checklist task lists render cleanly on mobile and desktop.</p>
                  </div>
                  <div className="p-3 bg-[#FDF9F0] border border-[#1a1a1a]">
                    <span className="font-bold text-[#1a1a1a] block mb-1">Fenced Code Blocks</span>
                    <p className="text-gray-700 font-medium">Code blocks with syntax language tags (e.g., <code>```javascript</code>) feature dark backdrops, monospace styling, and horizontal scrolling.</p>
                  </div>
                  <div className="p-3 bg-[#FDF9F0] border border-[#1a1a1a]">
                    <span className="font-bold text-green-700 block mb-1">Live Preview Modal</span>
                    <p className="text-gray-700 font-medium">Click the <strong>Preview</strong> button in the Business Details tab anytime to inspect the fully rendered Markdown document before saving.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI Model Providers */}
          {activeTab === "providers" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  Multi-Model Engine
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  11+ Model Providers & Custom APIs
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                  Aptus AI includes native out-of-the-box Groq LPU inference. You can also plug in your own API key to switch between top LLM providers, or connect your local Ollama / vLLM endpoint.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "Groq (Default)", desc: "Sub-second LPU inference using Llama 3.3 70B & 8B." },
                  { name: "OpenAI", desc: "GPT-4o, GPT-4o-mini, and reasoning models." },
                  { name: "Google Gemini", desc: "Gemini 1.5 Flash and Gemini 1.5 Pro." },
                  { name: "DeepSeek", desc: "DeepSeek V3 Chat and DeepSeek R1 Reasoning." },
                  { name: "Anthropic Claude", desc: "Claude 3.5 Sonnet and Haiku." },
                  { name: "Mistral AI", desc: "Mistral Large and Mixtral 8x7B." },
                  { name: "Perplexity", desc: "Sonar online search-grounded models." },
                  { name: "Cohere", desc: "Command R+ enterprise models." },
                  { name: "xAI (Grok)", desc: "Grok-Beta inference models." },
                  { name: "OpenRouter", desc: "Unified multi-provider aggregation gateway." },
                  { name: "Custom API Endpoint", desc: "Any OpenAI-compatible server (Ollama, vLLM, LocalAI)." },
                ].map((p, i) => (
                  <div key={i} className="p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                    <span className="font-syne font-black text-xs uppercase text-[#1a1a1a] block mb-1">
                      {p.name}
                    </span>
                    <p className="text-[11px] font-medium text-gray-600 leading-snug">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-2 border-[#1a1a1a]">
                <h4 className="font-syne font-black text-xs uppercase text-[#1a1a1a] mb-1">
                  Connecting a Custom Ollama / vLLM Endpoint
                </h4>
                <p className="text-xs font-medium text-gray-700 leading-relaxed mb-2">
                  Select <strong>Custom (OpenAI-compatible)</strong> in the AI Model & Keys tab and enter your endpoint URL (e.g., <code>http://localhost:11434/v1</code>) along with your model identifier. Aptus AI forwards requests directly while maintaining session state and analytics.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: Props API Reference */}
          {activeTab === "props" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  API Reference
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  Props API Reference
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                  Properties supported by the <code className="font-mono font-bold bg-[#FDF9F0] px-1 border border-[#1a1a1a]">ChatBot</code> React component:
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
                      <td className="p-2.5 text-gray-400">required</td>
                      <td className="p-2.5">Your unique business token generated in the dashboard.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#FF4D00]">apiUrl *</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 text-gray-400">required</td>
                      <td className="p-2.5">Base URL of the Aptus AI backend instance.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">theme</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 font-mono">dashboard</td>
                      <td className="p-2.5">Theme preset: "aptus", "boty", "chatgpt", or "compute". Overrides dashboard if supplied.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">position</td>
                      <td className="p-2.5 font-mono text-gray-600">"left" | "right"</td>
                      <td className="p-2.5 font-mono">"right"</td>
                      <td className="p-2.5">Floating trigger button alignment on the user's screen.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">botName</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 font-mono">dashboard</td>
                      <td className="p-2.5">Display name shown in the chat window header.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">welcomeMessage</td>
                      <td className="p-2.5 font-mono text-gray-600">string</td>
                      <td className="p-2.5 font-mono">dashboard</td>
                      <td className="p-2.5">Initial greeting bubble displayed when visitor opens chat.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0]">
                      <td className="p-2.5 font-mono font-bold text-[#1a1a1a]">wantToShowSuggestions</td>
                      <td className="p-2.5 font-mono text-gray-600">boolean</td>
                      <td className="p-2.5 font-mono">false</td>
                      <td className="p-2.5">Renders quick-tap FAQ suggestion chips beneath bot replies.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: Live Human Agent & Voice STT */}
          {activeTab === "liveagent" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  Customer Operations
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  Live Agent Takeover & Voice STT
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                  Combine fully automated AI grounding with instant human intervention and real-time voice speech recognition.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] flex items-center gap-2 mb-1.5">
                    <Headphones className="w-4 h-4 text-[#2563EB]" />
                    <span>How Live Agent Takeover Works</span>
                  </h3>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    1. When a visitor needs human help, they tap the <strong>Live Support</strong> icon in the widget.<br />
                    2. In the dashboard <strong>Sessions</strong> inbox, the conversation card flags with a blue <strong>LIVE</strong> indicator.<br />
                    3. The business operator clicks <strong>Take Over Chat</strong>. AI auto-replies are paused, and messages typed by the operator stream live to the visitor.<br />
                    4. When resolved, the operator clicks <strong>Hand Back to AI</strong> to resume automated assistant responses.
                  </p>
                </div>

                <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm">
                  <h3 className="font-syne font-black text-xs uppercase text-[#1a1a1a] flex items-center gap-2 mb-1.5">
                    <Mic className="w-4 h-4 text-[#FF4D00]" />
                    <span>Streaming Speech-to-Text (STT)</span>
                  </h3>
                  <p className="text-xs font-medium text-gray-700 leading-relaxed">
                    Visitors can click the microphone icon in the widget to speak their query. Aptus AI leverages native browser <code>webkitSpeechRecognition</code> with live interim results so words appear in the input box word-by-word as spoken. If browser speech recognition is not supported on the client device, it falls back seamlessly to Groq Whisper Large v3 Turbo server-side audio transcription.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Themes & Branding */}
          {activeTab === "themes" && (
            <div className="space-y-6">
              <div>
                <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-2">
                  Customization
                </span>
                <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a]">
                  Themes, Avatars & Border Shapes
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">
                  Style the widget to match your website identity with preset themes, custom vector avatars, and border radiuses.
                </p>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "aptus", name: "Aptus Official", desc: "Signature neo-brutalist theme with bold 3px black borders and orange accents.", color: "bg-[#FF4D00]" },
                  { id: "boty", name: "Boty Organic", desc: "Clean forest green palette with soft, minimal modern styling.", color: "bg-[#2D5A27]" },
                  { id: "chatgpt", name: "ChatGPT Dark", desc: "Sleek charcoal dark mode designed for SaaS applications.", color: "bg-[#202123]" },
                  { id: "compute", name: "Retro CRT Terminal", desc: "High-contrast monospace cyber-terminal aesthetic.", color: "bg-[#1a1a1a]" },
                ].map((t) => (
                  <div key={t.id} className="p-3.5 bg-white border-2 border-[#1a1a1a] shadow-neo-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-syne font-black text-xs uppercase text-[#1a1a1a]">{t.name}</span>
                      <span className={`w-3.5 h-3.5 border border-[#1a1a1a] ${t.color}`}></span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-2">{t.desc}</p>
                    <code className="text-[11px] font-mono font-bold text-[#FF4D00]">theme="{t.id}"</code>
                  </div>
                ))}
              </div>

              {/* Shapes & Contrast */}
              <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] space-y-2">
                <h4 className="font-syne font-black text-xs uppercase text-[#1a1a1a]">
                  Corner Shapes & High-Contrast Typography
                </h4>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  In the <strong>Appearance & Theme</strong> tab, select between <strong>Sharp Neo-Brutalist</strong> (0px radius), <strong>Smooth Rounded</strong> (12px radius), or <strong>Pill Stadium</strong> (24px radius). Text contrast colors auto-adjust dynamically to ensure legibility across bright, dark, or neon primary colors.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
