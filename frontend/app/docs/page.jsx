"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Terminal,
  Code2,
  FileCode,
  Settings,
  Cpu,
  Headphones,
  Shield,
  Copy,
  Check,
  Book,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import baseurl from "@/store/baseurl";

export default function DocsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("quickstart");
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    document.title = "Setup Guide & Documentation — Aptus AI";
  }, []);

  const copyCode = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const navGroups = [
    {
      category: "GETTING STARTED",
      items: [
        { id: "quickstart", label: "Quickstart", icon: Terminal },
        { id: "installation", label: "Installation", icon: FileCode },
      ],
    },
    {
      category: "FRAMEWORKS",
      items: [
        { id: "nextjs", label: "Next.js (App & Pages)", icon: Code2 },
        { id: "react", label: "React (Vite / CRA)", icon: Code2 },
        { id: "script-tag", label: "HTML & CMS (Shopify)", icon: Code2 },
      ],
    },
    {
      category: "CONFIGURATION",
      items: [
        { id: "props", label: "Props API Reference", icon: Settings },
        { id: "knowledge", label: "Knowledge Base (GFM)", icon: Book },
        { id: "models", label: "LLM Providers & Ollama", icon: Cpu },
        { id: "liveagent", label: "Live Agent Takeover", icon: Headphones },
        { id: "security", label: "Domain Security", icon: Shield },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1a1a1a]">
      {/* Signature Site Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b-3 border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Section Pill */}
            <div className="flex items-center gap-3">
              <div
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => router.push("/")}
              >
                <img
                  src="/aptus-logo.png"
                  alt="Aptus AI"
                  className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition-transform"
                />
              </div>
              <span className="font-mono text-xs font-black px-2.5 py-1 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm text-[#1a1a1a] uppercase">
                Setup Guide
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.npmjs.com/package/aptus-ai-chatbot-widget"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FDF9F0] text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-mono text-xs font-bold hover:bg-white transition-all"
              >
                <span>npm v1.0.12</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Button
                onClick={() => router.push("/")}
                className="btn-neo text-xs px-4 py-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Home</span>
              </Button>

              <Button
                onClick={() => router.push("/start")}
                className="btn-neo-primary text-xs px-4 py-2"
              >
                <span>Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Neo-Brutalist Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-3 sm:p-4 shrink-0 md:sticky md:top-24">
            <div className="space-y-5">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1.5">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-gray-500 block px-2">
                    {group.category}
                  </span>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = activeSection === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 border-2 border-[#1a1a1a] text-xs font-black uppercase transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#FF4D00] text-white shadow-neo-sm translate-x-1"
                              : "bg-white text-[#1a1a1a] hover:bg-[#FDF9F0]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Documentation Card */}
          <main className="flex-1 w-full bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 sm:p-8 md:p-10 flex flex-col gap-6">
            {/* 1. QUICKSTART */}
            {activeSection === "quickstart" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Getting Started
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    Quickstart Guide
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Deploy your grounded AI chatbot on your website in 3 straightforward steps.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Step 1 */}
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 bg-[#FF4D00] text-white font-mono font-bold text-xs flex items-center justify-center border-2 border-[#1a1a1a] shadow-neo-sm">
                        1
                      </span>
                      <h3 className="font-syne font-bold text-sm uppercase text-[#1a1a1a]">
                        Install Chatbot Widget
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-gray-700 pl-8">
                      Install the official React widget package via npm:
                    </p>
                    <div className="ml-8 bg-[#1a1a1a] p-3 border-2 border-[#1a1a1a] flex items-center justify-between gap-3 shadow-neo-sm">
                      <code className="text-[#BFF000] font-mono text-xs">
                        npm install aptus-ai-chatbot-widget
                      </code>
                      <button
                        onClick={() => copyCode("npm install aptus-ai-chatbot-widget", "qs-npm")}
                        className="px-2.5 py-1 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm text-[10px] font-black uppercase hover:bg-[#BFF000] transition-all cursor-pointer flex items-center gap-1"
                      >
                        {copiedKey === "qs-npm" ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === "qs-npm" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 bg-[#2D31FA] text-white font-mono font-bold text-xs flex items-center justify-center border-2 border-[#1a1a1a] shadow-neo-sm">
                        2
                      </span>
                      <h3 className="font-syne font-bold text-sm uppercase text-[#1a1a1a]">
                        Copy Business Token
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-gray-700 pl-8 leading-relaxed">
                      Log in to your Aptus AI dashboard, open <strong>Token & Security</strong>, and copy your business token. You can also specify your website domain here to restrict unauthorized usage.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 bg-[#BFF000] text-[#1a1a1a] font-mono font-bold text-xs flex items-center justify-center border-2 border-[#1a1a1a] shadow-neo-sm">
                        3
                      </span>
                      <h3 className="font-syne font-bold text-sm uppercase text-[#1a1a1a]">
                        Embed Component in Layout
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-gray-700 pl-8 leading-relaxed">
                      Import and mount the <code className="font-mono font-bold text-xs bg-white px-1 border border-[#1a1a1a]">&lt;ChatBot /&gt;</code> component. Appearance, colors, and welcome greetings synchronize live from your dashboard.
                    </p>

                    <div className="ml-8 border-2 border-[#1a1a1a] shadow-neo-sm">
                      <div className="bg-[#FAF8F5] px-3 py-2 border-b-2 border-[#1a1a1a] flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-[#1a1a1a]">app/layout.jsx</span>
                        <button
                          onClick={() => copyCode(
`import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatBot 
          token="YOUR_BUSINESS_TOKEN"
          apiUrl="${baseurl}"
        />
      </body>
    </html>
  );
}`, "qs-snippet")}
                          className="px-2.5 py-1 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm text-[10px] font-black uppercase hover:bg-[#BFF000] transition-all cursor-pointer flex items-center gap-1"
                        >
                          {copiedKey === "qs-snippet" ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "qs-snippet" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="bg-[#1a1a1a] p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatBot 
          token="YOUR_BUSINESS_TOKEN"
          apiUrl="${baseurl}"
        />
      </body>
    </html>
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. INSTALLATION */}
            {activeSection === "installation" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Package Setup
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    Installation
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Requirements: Node.js 18+, React 17.0+ or React 18.0+.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="border-2 border-[#1a1a1a] shadow-neo-sm">
                    <div className="bg-[#FAF8F5] px-3 py-2 border-b-2 border-[#1a1a1a]">
                      <span className="font-mono text-xs font-black text-[#1a1a1a]">Package Managers</span>
                    </div>
                    <div className="bg-[#1a1a1a] p-4 font-mono text-xs space-y-2.5">
                      <div className="flex items-center justify-between text-gray-400">
                        <span># npm</span>
                        <code className="text-[#BFF000]">npm install aptus-ai-chatbot-widget</code>
                      </div>
                      <div className="flex items-center justify-between text-gray-400 border-t border-gray-800 pt-2">
                        <span># pnpm</span>
                        <code className="text-[#BFF000]">pnpm add aptus-ai-chatbot-widget</code>
                      </div>
                      <div className="flex items-center justify-between text-gray-400 border-t border-gray-800 pt-2">
                        <span># yarn</span>
                        <code className="text-[#BFF000]">yarn add aptus-ai-chatbot-widget</code>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm space-y-2">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                      Peer Dependencies
                    </h3>
                    <p className="text-xs font-medium text-gray-700 leading-relaxed">
                      In existing Next.js or React setups, peer dependencies are already included. If installing into a blank project, ensure <code className="font-mono font-bold">styled-components</code> is present:
                    </p>
                    <code className="block bg-white p-2.5 border-2 border-[#1a1a1a] font-mono text-xs font-bold text-[#1a1a1a]">
                      npm install styled-components@^6.1.13
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NEXT.JS */}
            {activeSection === "nextjs" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Next.js Framework
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    Next.js Setup
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Compatible with Next.js 13, 14, and 15 (App Router and Pages Router).
                  </p>
                </div>

                <div className="space-y-6">
                  {/* App Router */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FF4D00] text-white font-mono text-[10px] font-black uppercase">
                        APP ROUTER
                      </span>
                      <span className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                        app/layout.jsx
                      </span>
                    </div>
                    <div className="border-2 border-[#1a1a1a] shadow-neo-sm">
                      <pre className="bg-[#1a1a1a] p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`"use client";
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatBot 
          token="YOUR_BUSINESS_TOKEN"
          apiUrl="${baseurl}"
          position="right"
        />
      </body>
    </html>
  );
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Pages Router */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#2D31FA] text-white font-mono text-[10px] font-black uppercase">
                        PAGES ROUTER
                      </span>
                      <span className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                        pages/_app.jsx
                      </span>
                    </div>
                    <div className="border-2 border-[#1a1a1a] shadow-neo-sm">
                      <pre className="bg-[#1a1a1a] p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ChatBot 
        token="YOUR_BUSINESS_TOKEN"
        apiUrl="${baseurl}"
      />
    </>
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. REACT VITE */}
            {activeSection === "react" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    SPA Framework
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    React (Vite / CRA)
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Standard single page application integration.
                  </p>
                </div>

                <div className="border-2 border-[#1a1a1a] shadow-neo-sm">
                  <div className="bg-[#FAF8F5] px-3 py-2 border-b-2 border-[#1a1a1a]">
                    <span className="font-mono text-xs font-black text-[#1a1a1a]">src/App.jsx</span>
                  </div>
                  <pre className="bg-[#1a1a1a] p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot-widget';

function App() {
  return (
    <div>
      <main>
        <h1>My Web Application</h1>
      </main>

      <ChatBot 
        token="YOUR_BUSINESS_TOKEN"
        apiUrl="${baseurl}"
        wantToShowSuggestions={true}
      />
    </div>
  );
}

export default App;`}
                  </pre>
                </div>
              </div>
            )}

            {/* 5. HTML SCRIPT TAG */}
            {activeSection === "script-tag" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    No-Build Setup
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    HTML & CMS Integration
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Integrate into Shopify, WordPress, Webflow, Squarespace, or static HTML pages.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-medium text-gray-700">
                    Paste this script tag directly before the closing <code className="font-mono font-bold bg-[#FDF9F0] border border-[#1a1a1a] px-1">&lt;/body&gt;</code> tag:
                  </p>

                  <div className="border-2 border-[#1a1a1a] shadow-neo-sm">
                    <pre className="bg-[#1a1a1a] p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`<script
  src="https://unpkg.com/aptus-ai-chatbot-widget@1.0.12/dist/index.js"
  data-token="YOUR_BUSINESS_TOKEN"
  data-api-url="${baseurl}"
  defer>
</script>`}
                    </pre>
                  </div>

                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm space-y-2">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                      Shopify Theme Instructions
                    </h3>
                    <p className="text-xs font-medium text-gray-700 leading-relaxed">
                      Go to <strong>Online Store &rarr; Themes &rarr; Actions &rarr; Edit code</strong>. Open <code className="font-mono font-bold">layout/theme.liquid</code>, scroll to the bottom, and paste the script tag right above <code className="font-mono font-bold">&lt;/body&gt;</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PROPS API */}
            {activeSection === "props" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Component API
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    Props API Reference
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Configuration options for the <code className="font-mono font-bold text-xs">&lt;ChatBot /&gt;</code> component.
                  </p>
                </div>

                <div className="border-2 border-[#1a1a1a] shadow-neo-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#1a1a1a] text-white font-syne font-black text-xs uppercase">
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Prop</th>
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Type</th>
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Default</th>
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-[#1a1a1a] font-medium">
                      <tr className="bg-white">
                        <td className="p-3 font-mono font-bold text-[#FF4D00]">token *</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 text-red-600 font-bold">required</td>
                        <td className="p-3">Unique business authentication token from your dashboard.</td>
                      </tr>
                      <tr className="bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#FF4D00]">apiUrl *</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 text-red-600 font-bold">required</td>
                        <td className="p-3">Backend API base URL endpoint.</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">theme</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3">Preset theme override: <code>"aptus"</code>, <code>"boty"</code>, <code>"chatgpt"</code>, <code>"compute"</code>, <code>"crosshaven"</code>, <code>"cyberpunk"</code>.</td>
                      </tr>
                      <tr className="bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">position</td>
                        <td className="p-3 font-mono text-gray-600">"left" | "right"</td>
                        <td className="p-3 font-mono">"right"</td>
                        <td className="p-3">Floating launcher button alignment on viewport.</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">botName</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3">Chatbot name displayed in header. Defaults to dashboard name.</td>
                      </tr>
                      <tr className="bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">welcomeMessage</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3">Initial message bubble shown upon chat launch.</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">borderRadius</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">theme default</td>
                        <td className="p-3">Shape override: <code>"0px"</code> (sharp), <code>"12px"</code> (rounded), <code>"24px"</code> (pill).</td>
                      </tr>
                      <tr className="bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">wantToShowSuggestions</td>
                        <td className="p-3 font-mono text-gray-600">boolean</td>
                        <td className="p-3 font-mono">false</td>
                        <td className="p-3">Enables interactive FAQ suggestion chips under answers.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. KNOWLEDGE BASE & GFM MARKDOWN */}
            {activeSection === "knowledge" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Data Grounding
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    Knowledge Base & Markdown
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Grounded inference rules, threshold safety gate, and GitHub Flavored Markdown (GFM) specs.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm space-y-2">
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FF4D00] text-white">
                      THRESHOLD SAFETY GATE
                    </span>
                    <p className="text-xs font-medium text-gray-800 leading-relaxed">
                      To prevent blank replies or hallucinations, the chatbot will remain in standby until your business has provided either:
                    </p>
                    <ul className="list-disc list-inside text-xs font-black text-[#1a1a1a] space-y-1">
                      <li>At least 10 verified Question & Answer pairs, OR</li>
                      <li>A minimum of 1,000 words of Markdown documentation (up to 5,000 words).</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                      Supported GitHub Flavored Markdown (GFM) Formatting
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 border-2 border-[#1a1a1a] bg-white shadow-neo-sm">
                        <strong className="block text-[#FF4D00] mb-1 font-syne uppercase">Headings & Text</strong>
                        <p className="text-gray-700 font-medium">Headings (<code>#</code> to <code>######</code>), <code>**bold**</code>, <code>*italic*</code>, and <code>~~strikethrough~~</code>.</p>
                      </div>
                      <div className="p-3.5 border-2 border-[#1a1a1a] bg-white shadow-neo-sm">
                        <strong className="block text-[#2D31FA] mb-1 font-syne uppercase">Tables & Checklists</strong>
                        <p className="text-gray-700 font-medium">Multi-column tables (<code>| col 1 | col 2 |</code>) with alternating rows and task lists (<code>- [x]</code>).</p>
                      </div>
                      <div className="p-3.5 border-2 border-[#1a1a1a] bg-white shadow-neo-sm">
                        <strong className="block text-[#1a1a1a] mb-1 font-syne uppercase">Fenced Code Blocks</strong>
                        <p className="text-gray-700 font-medium">Triple backtick code blocks with syntax language pills and horizontal scrolling.</p>
                      </div>
                      <div className="p-3.5 border-2 border-[#1a1a1a] bg-white shadow-neo-sm">
                        <strong className="block text-green-700 mb-1 font-syne uppercase">Strict Grounding</strong>
                        <p className="text-gray-700 font-medium">The AI assistant is strictly prompted to answer only from your documentation and decline out-of-scope queries.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. MODEL PROVIDERS */}
            {activeSection === "models" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Multi-Model Inference
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    LLM Providers & Ollama
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Connect cloud inference providers or your own self-hosted Ollama / vLLM API.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm space-y-2">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                      Connecting Local Ollama / vLLM
                    </h3>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">
                      1. Open <strong>AI Model & Keys</strong> in your dashboard.<br />
                      2. Select <strong>Custom (OpenAI-compatible)</strong> from the provider list.<br />
                      3. Enter your base URL (e.g. <code className="font-mono bg-white px-1 border border-[#1a1a1a]">http://localhost:11434/v1</code>).<br />
                      4. Enter your model identifier (e.g. <code className="font-mono bg-white px-1 border border-[#1a1a1a]">llama3.2:latest</code>).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-gray-500">11+ Supported Providers</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono font-bold">
                      {["Groq (Default)", "OpenAI", "Google Gemini", "Anthropic Claude", "DeepSeek", "Mistral AI", "Perplexity", "Cohere", "xAI (Grok)", "OpenRouter", "Custom API"].map((p, i) => (
                        <div key={i} className="p-2.5 bg-white border-2 border-[#1a1a1a] shadow-neo-sm text-center">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. LIVE AGENT */}
            {activeSection === "liveagent" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Human Operations
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    Live Agent Takeover
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Seamless escalation from automated AI assistance to human support staff.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white border-2 border-[#1a1a1a] shadow-neo-sm space-y-3">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                      Session State Flow
                    </h3>
                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                        <strong className="text-[#10b981]">1. active:</strong> AI responds automatically to visitor inquiries using verified documentation.
                      </div>
                      <div className="p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                        <strong className="text-[#FF4D00]">2. waiting_human:</strong> Visitor requests live support. AI inference pauses and conversation flags in dashboard.
                      </div>
                      <div className="p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                        <strong className="text-[#2563EB]">3. human_active:</strong> Operator clicks "Take Over Chat". Direct replies typed in dashboard stream to visitor widget.
                      </div>
                      <div className="p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                        <strong className="text-[#1a1a1a]">4. handback:</strong> Operator clicks "Hand Back to AI". Automated AI assistant resumes immediately.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. DOMAIN SECURITY */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-4">
                  <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2 py-0.5 text-[10px] font-black uppercase text-[#1a1a1a] shadow-neo-sm inline-block mb-1.5">
                    Origin Protection
                  </span>
                  <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-[#1a1a1a]">
                    Domain Whitelisting
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                    Protect your API token allowances from unauthorized external domain hotlinking.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-medium text-gray-700 leading-relaxed">
                  <p>
                    By default, your token can be restricted to your specific web domain. To configure domain origin protection:
                  </p>

                  <ol className="list-decimal list-inside space-y-2 p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm font-bold text-[#1a1a1a]">
                    <li>Open <strong>Token & Security</strong> in your Aptus AI dashboard.</li>
                    <li>Enter your production domain (e.g. <code className="font-mono bg-white px-1.5 py-0.5 border border-[#1a1a1a]">mywebsite.com</code>).</li>
                    <li>Click <strong>Save Domain Security</strong>.</li>
                  </ol>

                  <p className="text-gray-600">
                    Requests originating from unauthorized domains with non-matching <code>Origin</code> or <code>Referer</code> headers receive an automatic HTTP 403 Forbidden response.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
