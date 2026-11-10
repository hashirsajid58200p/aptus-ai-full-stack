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
  ExternalLink,
  ChevronRight,
  Book,
} from "lucide-react";
import { useRouter } from "next/navigation";
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

  const navItems = [
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
        { id: "knowledge", label: "Knowledge Base & Markdown", icon: Book },
        { id: "models", label: "LLM Providers & Ollama", icon: Cpu },
        { id: "liveagent", label: "Live Agent Takeover", icon: Headphones },
        { id: "security", label: "Domain Whitelisting", icon: Shield },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1a1a1a] font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b-3 border-[#1a1a1a] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-neo-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FDF9F0] text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] shadow-neo-sm hover:bg-white transition-all uppercase text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <div className="h-5 w-[2px] bg-[#1a1a1a]/20"></div>
          <div className="flex items-center gap-2">
            <span className="font-syne text-base sm:text-lg font-black uppercase tracking-tight">
              Aptus AI
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#BFF000] border border-[#1a1a1a] text-[#1a1a1a]">
              Setup Guide
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.npmjs.com/package/aptus-ai-chatbot-widget"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-mono text-xs font-bold hover:bg-[#FDF9F0] transition-colors"
          >
            <span>v1.0.12</span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </a>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-65px)]">
        {/* Sticky Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 border-b-3 md:border-b-0 md:border-r-3 border-[#1a1a1a] bg-white p-4 md:p-6 md:sticky md:top-[65px] md:h-[calc(100vh-65px)] md:overflow-y-auto">
          <div className="space-y-6">
            {navItems.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-mono font-black tracking-wider text-gray-400 block px-2">
                  {group.category}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                          isActive
                            ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-neo-sm"
                            : "bg-transparent text-gray-700 border-transparent hover:bg-[#FDF9F0] hover:text-[#1a1a1a]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#BFF000]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Documentation Content View */}
        <main className="flex-1 bg-white p-6 sm:p-10 md:p-12 overflow-y-auto">
          <div className="max-w-3xl space-y-10">
            {/* 1. QUICKSTART */}
            {activeSection === "quickstart" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    Quickstart Guide
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Get an on-brand AI chatbot running on your website in under 2 minutes.
                  </p>
                </div>

                <div className="space-y-6 border-t-2 border-[#1a1a1a] pt-6">
                  {/* Step 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#FF4D00] text-white font-mono text-xs font-bold flex items-center justify-center border border-[#1a1a1a]">
                        1
                      </span>
                      <h3 className="font-syne font-bold text-sm uppercase text-[#1a1a1a]">
                        Install Package
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-gray-600">
                      Add the chatbot widget component to your React or Next.js project.
                    </p>
                    <div className="bg-[#1a1a1a] p-3 border-2 border-[#1a1a1a] flex items-center justify-between gap-3">
                      <code className="text-[#BFF000] font-mono text-xs">
                        npm install aptus-ai-chatbot-widget
                      </code>
                      <button
                        onClick={() => copyCode("npm install aptus-ai-chatbot-widget", "qs-npm")}
                        className="px-2 py-1 bg-white text-[#1a1a1a] text-[11px] font-bold uppercase border border-[#1a1a1a] hover:bg-[#BFF000] cursor-pointer"
                      >
                        {copiedKey === "qs-npm" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#2D31FA] text-white font-mono text-xs font-bold flex items-center justify-center border border-[#1a1a1a]">
                        2
                      </span>
                      <h3 className="font-syne font-bold text-sm uppercase text-[#1a1a1a]">
                        Copy Your Business Token
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-gray-600">
                      Open your Aptus AI dashboard, navigate to <strong>Token & Security</strong>, and copy your unique token (e.g. <code className="bg-[#FDF9F0] border border-[#1a1a1a] px-1 font-mono text-[11px]">A1ED-AC9D6DEE-46A3DFD8</code>).
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#BFF000] text-[#1a1a1a] font-mono text-xs font-bold flex items-center justify-center border border-[#1a1a1a]">
                        3
                      </span>
                      <h3 className="font-syne font-bold text-sm uppercase text-[#1a1a1a]">
                        Add Component to Layout
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-gray-600">
                      Mount the <code className="font-mono text-xs font-bold">&lt;ChatBot /&gt;</code> component. Bot name, theme, and custom avatars automatically synchronize from your dashboard.
                    </p>
                    <div className="bg-[#1a1a1a] border-2 border-[#1a1a1a]">
                      <div className="bg-[#2a2a2a] px-3 py-1.5 flex items-center justify-between border-b border-gray-700">
                        <span className="font-mono text-[11px] text-gray-300">app/layout.jsx</span>
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
}`, "qs-code")}
                          className="px-2 py-0.5 bg-white text-[#1a1a1a] text-[10px] font-bold uppercase border border-[#1a1a1a] hover:bg-[#BFF000] cursor-pointer"
                        >
                          {copiedKey === "qs-code" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
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
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    Installation
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Install via npm, pnpm, or yarn. Requirements: React 17.0+ or React 18.0+.
                  </p>
                </div>

                <div className="space-y-4 border-t-2 border-[#1a1a1a] pt-6">
                  {/* Package Managers */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-gray-500">Package Managers</span>
                    <div className="bg-[#1a1a1a] p-4 border-2 border-[#1a1a1a] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-400"># npm</span>
                        <code className="text-[#BFF000] font-mono text-xs">npm install aptus-ai-chatbot-widget</code>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-800 pt-2">
                        <span className="text-xs font-mono text-gray-400"># pnpm</span>
                        <code className="text-[#BFF000] font-mono text-xs">pnpm add aptus-ai-chatbot-widget</code>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-800 pt-2">
                        <span className="text-xs font-mono text-gray-400"># yarn</span>
                        <code className="text-[#BFF000] font-mono text-xs">yarn add aptus-ai-chatbot-widget</code>
                      </div>
                    </div>
                  </div>

                  {/* Peer Dependencies */}
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] space-y-2">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">Peer Dependencies</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      The widget requires standard React peer dependencies. In existing React or Next.js projects, these are already installed:
                    </p>
                    <code className="block bg-white p-2 border border-[#1a1a1a] text-xs font-mono text-gray-800">
                      "react": "&gt;=17.0.0", "react-dom": "&gt;=17.0.0", "styled-components": "&gt;=5.0.0"
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NEXT.JS GUIDE */}
            {activeSection === "nextjs" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    Next.js Integration
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Integration instructions for Next.js 13+ App Router and Pages Router.
                  </p>
                </div>

                <div className="space-y-6 border-t-2 border-[#1a1a1a] pt-6">
                  {/* App Router */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FF4D00] text-white font-mono text-[10px] font-bold">
                        APP ROUTER
                      </span>
                      <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                        Root Layout (app/layout.jsx)
                      </h3>
                    </div>
                    <div className="bg-[#1a1a1a] border-2 border-[#1a1a1a]">
                      <pre className="p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
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
                      <span className="px-2 py-0.5 bg-[#2D31FA] text-white font-mono text-[10px] font-bold">
                        PAGES ROUTER
                      </span>
                      <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                        Custom App (pages/_app.jsx)
                      </h3>
                    </div>
                    <div className="bg-[#1a1a1a] border-2 border-[#1a1a1a]">
                      <pre className="p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function MyApp({ Component, pageProps }) {
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

            {/* 4. REACT VITE GUIDE */}
            {activeSection === "react" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    React (Vite / CRA)
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Standard Single Page Application (SPA) integration.
                  </p>
                </div>

                <div className="space-y-4 border-t-2 border-[#1a1a1a] pt-6">
                  <div className="bg-[#1a1a1a] border-2 border-[#1a1a1a]">
                    <div className="bg-[#2a2a2a] px-3 py-1.5 flex items-center justify-between border-b border-gray-700">
                      <span className="font-mono text-[11px] text-gray-300">src/App.jsx</span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot-widget';

function App() {
  return (
    <div>
      <main>
        <h1>Welcome to My Store</h1>
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
              </div>
            )}

            {/* 5. SCRIPT TAG / CMS GUIDE */}
            {activeSection === "script-tag" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    HTML & CMS Integration
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    For websites without React (Shopify, WordPress, Webflow, Squarespace, or static HTML).
                  </p>
                </div>

                <div className="space-y-4 border-t-2 border-[#1a1a1a] pt-6">
                  <p className="text-xs text-gray-700 font-medium">
                    Paste this snippet directly before the closing <code className="font-mono text-xs bg-gray-100 px-1">&lt;/body&gt;</code> tag in your theme template:
                  </p>

                  <div className="bg-[#1a1a1a] border-2 border-[#1a1a1a]">
                    <pre className="p-4 text-xs font-mono text-white overflow-x-auto leading-relaxed">
{`<script
  src="https://unpkg.com/aptus-ai-chatbot-widget@1.0.12/dist/index.js"
  data-token="YOUR_BUSINESS_TOKEN"
  data-api-url="${baseurl}"
  defer>
</script>`}
                    </pre>
                  </div>

                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-medium space-y-1">
                    <span className="font-bold uppercase text-[#1a1a1a]">Shopify Instructions:</span>
                    <p className="text-gray-700">Online Store &rarr; Themes &rarr; Edit Code &rarr; <code className="font-mono">layout/theme.liquid</code> &rarr; Paste before <code className="font-mono">&lt;/body&gt;</code>.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PROPS REFERENCE */}
            {activeSection === "props" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    Props API Reference
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Technical parameters accepted by the <code className="font-mono font-bold text-xs">&lt;ChatBot /&gt;</code> component.
                  </p>
                </div>

                <div className="border-t-2 border-[#1a1a1a] pt-6 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#1a1a1a] text-white font-mono uppercase tracking-wider text-[11px]">
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Prop</th>
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Type</th>
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Default</th>
                        <th className="p-3 border-b-2 border-[#1a1a1a]">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#FF4D00]">token *</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 text-red-500 font-bold">required</td>
                        <td className="p-3">Unique business authentication token from your dashboard.</td>
                      </tr>
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#FF4D00]">apiUrl *</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 text-red-500 font-bold">required</td>
                        <td className="p-3">Backend API base URL (e.g. <code>http://localhost:3100/api/v1</code>).</td>
                      </tr>
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">theme</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3">Overrides theme: <code>"aptus"</code>, <code>"boty"</code>, <code>"chatgpt"</code>, <code>"compute"</code>, <code>"crosshaven"</code>, <code>"cyberpunk"</code>.</td>
                      </tr>
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">position</td>
                        <td className="p-3 font-mono text-gray-600">"left" | "right"</td>
                        <td className="p-3 font-mono">"right"</td>
                        <td className="p-3">Screen anchor alignment for the floating launcher button.</td>
                      </tr>
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">botName</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3">Custom bot name displayed in header. Defaults to dashboard setting.</td>
                      </tr>
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">welcomeMessage</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3">First greeting message bubble displayed when widget opens.</td>
                      </tr>
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">borderRadius</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">theme default</td>
                        <td className="p-3">Geometry override: <code>"0px"</code> (sharp), <code>"12px"</code> (rounded), <code>"24px"</code> (pill).</td>
                      </tr>
                      <tr className="hover:bg-[#FDF9F0]">
                        <td className="p-3 font-mono font-bold text-[#1a1a1a]">wantToShowSuggestions</td>
                        <td className="p-3 font-mono text-gray-600">boolean</td>
                        <td className="p-3 font-mono">false</td>
                        <td className="p-3">Enables interactive clickable FAQ recommendation pills under answers.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. KNOWLEDGE BASE & GFM MARKDOWN */}
            {activeSection === "knowledge" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    Knowledge Base & Markdown
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    How chatbot grounding, safety thresholds, and GitHub Flavored Markdown (GFM) formatting work.
                  </p>
                </div>

                <div className="space-y-6 border-t-2 border-[#1a1a1a] pt-6">
                  {/* Gate Rule */}
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] space-y-2">
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FF4D00] text-white">
                      THRESHOLD SAFETY GATE
                    </span>
                    <p className="text-xs font-medium text-gray-800 leading-relaxed">
                      To prevent blank answers or hallucinations, the chatbot activates only when your business provides either:
                    </p>
                    <ul className="list-disc list-inside text-xs font-bold text-[#1a1a1a] space-y-1">
                      <li>At least 10 Question & Answer pairs, OR</li>
                      <li>A minimum of 1,000 words of Markdown documentation (up to 5,000 words).</li>
                    </ul>
                  </div>

                  {/* Formatting Specs */}
                  <div className="space-y-3">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                      Supported GitHub Flavored Markdown (GFM) Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 border-2 border-[#1a1a1a] bg-white">
                        <strong className="block text-[#FF4D00] mb-1">Headings & Styling</strong>
                        <p className="text-gray-600">Supports <code># H1</code> through <code>###### H6</code>, <code>**bold**</code>, <code>*italic*</code>, <code>~~strikethrough~~</code>, and blockquotes (<code>&gt; quote</code>).</p>
                      </div>
                      <div className="p-3 border-2 border-[#1a1a1a] bg-white">
                        <strong className="block text-[#2D31FA] mb-1">Tables & Task Lists</strong>
                        <p className="text-gray-600">Multi-column tables (<code>| col 1 | col 2 |</code>) with alternating rows and task checklists (<code>- [x]</code>).</p>
                      </div>
                      <div className="p-3 border-2 border-[#1a1a1a] bg-white">
                        <strong className="block text-[#1a1a1a] mb-1">Fenced Code Blocks</strong>
                        <p className="text-gray-600">Triple backtick code blocks with language pills (e.g. <code>```javascript</code>) and horizontal scrollbars.</p>
                      </div>
                      <div className="p-3 border-2 border-[#1a1a1a] bg-white">
                        <strong className="block text-green-700 mb-1">Zero Hallucinations</strong>
                        <p className="text-gray-600">System prompts force LLM to answer strictly from your provided text and decline unknown questions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. MODEL PROVIDERS & OLLAMA */}
            {activeSection === "models" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    LLM Providers & Custom APIs
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Connect cloud inference providers or your own local Ollama / vLLM endpoints.
                  </p>
                </div>

                <div className="space-y-6 border-t-2 border-[#1a1a1a] pt-6">
                  <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] space-y-2">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">
                      Connecting Local Ollama / vLLM Endpoints
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      1. In the dashboard, open <strong>AI Model & Keys</strong>.<br />
                      2. Select <strong>Custom (OpenAI-compatible)</strong> from the provider list.<br />
                      3. Enter your base URL (e.g. <code className="font-mono bg-white px-1 border border-[#1a1a1a]">http://localhost:11434/v1</code> for Ollama).<br />
                      4. Enter your model name (e.g. <code className="font-mono bg-white px-1 border border-[#1a1a1a]">llama3.2:latest</code>).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-gray-500">Supported Cloud Providers</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono font-bold">
                      {["Groq (Default)", "OpenAI", "Google Gemini", "Anthropic Claude", "DeepSeek", "Mistral AI", "Perplexity", "Cohere", "xAI (Grok)", "OpenRouter", "Custom API"].map((p, i) => (
                        <div key={i} className="p-2.5 bg-white border border-[#1a1a1a] text-center">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. LIVE AGENT TAKEOVER */}
            {activeSection === "liveagent" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    Live Agent Takeover
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Protocol and dashboard controls for intervening in visitor conversations in real time.
                  </p>
                </div>

                <div className="space-y-4 border-t-2 border-[#1a1a1a] pt-6 text-xs text-gray-700 font-medium leading-relaxed">
                  <div className="p-4 bg-white border-2 border-[#1a1a1a] space-y-3">
                    <h3 className="font-syne font-bold text-xs uppercase text-[#1a1a1a]">Session Lifecycle</h3>
                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="p-2 bg-[#FDF9F0] border border-[#1a1a1a]">
                        <strong className="text-[#10b981]">1. active:</strong> Chatbot answers automatically using grounded documentation.
                      </div>
                      <div className="p-2 bg-[#FDF9F0] border border-[#1a1a1a]">
                        <strong className="text-[#FF4D00]">2. waiting_human:</strong> Visitor taps live agent icon. AI stops auto-replying and notifies dashboard.
                      </div>
                      <div className="p-2 bg-[#FDF9F0] border border-[#1a1a1a]">
                        <strong className="text-[#2563EB]">3. human_active:</strong> Operator clicks "Take Over Chat". Direct operator messages stream to visitor.
                      </div>
                      <div className="p-2 bg-[#FDF9F0] border border-[#1a1a1a]">
                        <strong className="text-gray-600">4. handback:</strong> Operator clicks "Hand Back to AI". Automated assistant resumes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. DOMAIN WHITELISTING */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-syne text-2xl sm:text-3xl font-black uppercase text-[#1a1a1a] tracking-tight">
                    Domain Whitelisting & Origin Security
                  </h1>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    Protect your API token allowances from unauthorized external hotlinking.
                  </p>
                </div>

                <div className="space-y-4 border-t-2 border-[#1a1a1a] pt-6 text-xs text-gray-700 font-medium leading-relaxed">
                  <p>
                    By default, your token is authorized for requests matching your domain. To restrict widget access strictly to your website:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                    <li>Navigate to <strong>Token & Security</strong> in your dashboard.</li>
                    <li>Enter your production domain (e.g. <code className="bg-white px-1 border border-[#1a1a1a] font-mono">mybusiness.com</code>).</li>
                    <li>Click <strong>Save Domain Security</strong>.</li>
                  </ol>
                  <p className="text-gray-600">
                    Requests arriving with non-matching <code>Origin</code> or <code>Referer</code> headers will be rejected with HTTP 403 Forbidden.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
