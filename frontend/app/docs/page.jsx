"use client";

import React, { useState, useEffect } from "react";
import {
  Terminal,
  Settings,
  Palette,
  Copy,
  Check,
} from "lucide-react";
import NavBar from "@/components/navbar";
import baseurl from "@/store/baseurl";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("quickstart");
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    document.title = "Setup Guide — Aptus AI";
  }, []);

  const copyCode = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const tabs = [
    { id: "quickstart", label: "Quickstart", icon: Terminal },
    { id: "props", label: "Props API", icon: Settings },
    { id: "themes", label: "Themes", icon: Palette },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F0] text-[#1a1a1a]">
      {/* Signature Site Navbar */}
      <NavBar />

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Minimal Tab Selector */}
          <aside className="w-full md:w-56 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-3 shrink-0 md:sticky md:top-24 flex flex-row md:flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 md:w-full flex items-center justify-between px-3.5 py-2.5 border-2 border-[#1a1a1a] text-xs font-black uppercase transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FF4D00] text-white shadow-neo-sm translate-x-0.5"
                      : "bg-white text-[#1a1a1a] hover:bg-[#FDF9F0]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Main Card */}
          <main className="flex-1 w-full bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 sm:p-8 flex flex-col gap-6">
            {/* TAB 1: QUICKSTART */}
            {activeTab === "quickstart" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-3">
                  <h1 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                    Quickstart
                  </h1>
                </div>

                {/* 1. Install */}
                <div className="space-y-2">
                  <label className="font-syne font-bold text-xs uppercase text-[#1a1a1a] block">
                    1. Install Package
                  </label>
                  <div className="bg-[#1a1a1a] p-3 border-2 border-[#1a1a1a] shadow-neo-sm flex items-center justify-between gap-3">
                    <code className="text-[#BFF000] font-mono text-xs font-bold">
                      npm install aptus-ai-chatbot-widget
                    </code>
                    <button
                      onClick={() => copyCode("npm install aptus-ai-chatbot-widget", "npm")}
                      className="px-2.5 py-1 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm text-[10px] font-black uppercase hover:bg-[#BFF000] transition-all cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === "npm" ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "npm" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* 2. React / Next.js Component */}
                <div className="space-y-2">
                  <label className="font-syne font-bold text-xs uppercase text-[#1a1a1a] block">
                    2. Add to React / Next.js App
                  </label>
                  <div className="border-2 border-[#1a1a1a] shadow-neo-sm">
                    <div className="bg-[#FDF9F0] px-3.5 py-2 border-b-2 border-[#1a1a1a] flex items-center justify-between">
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
}`, "code")}
                        className="px-2.5 py-1 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm text-[10px] font-black uppercase hover:bg-[#BFF000] transition-all cursor-pointer flex items-center gap-1"
                      >
                        {copiedKey === "code" ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === "code" ? "Copied" : "Copy"}</span>
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

                {/* Training Requirement Callout */}
                <div className="p-3.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] shadow-neo-sm flex items-start gap-2.5">
                  <span className="px-2 py-0.5 bg-[#FF4D00] text-white font-mono text-[10px] font-black uppercase shrink-0">
                    NOTE
                  </span>
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    Chatbot activates once your business adds at least <strong>10 FAQs</strong> or <strong>1,000 words Markdown</strong> in the Business Details dashboard tab.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PROPS API */}
            {activeTab === "props" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-3">
                  <h1 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                    Props Reference
                  </h1>
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
                    <tbody className="font-bold divide-y border-[#1a1a1a]">
                      <tr className="bg-white">
                        <td className="p-3 font-mono text-[#FF4D00]">token *</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 text-red-600">required</td>
                        <td className="p-3 font-medium">Business token from dashboard.</td>
                      </tr>
                      <tr className="bg-[#FDF9F0]">
                        <td className="p-3 font-mono text-[#FF4D00]">apiUrl *</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 text-red-600">required</td>
                        <td className="p-3 font-medium">API endpoint URL (e.g. <code>http://localhost:3100/api/v1</code>).</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-mono text-[#1a1a1a]">theme</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">"aptus"</td>
                        <td className="p-3 font-medium">Theme preset name. Overrides dashboard preset if passed.</td>
                      </tr>
                      <tr className="bg-[#FDF9F0]">
                        <td className="p-3 font-mono text-[#1a1a1a]">position</td>
                        <td className="p-3 font-mono text-gray-600">"left" | "right"</td>
                        <td className="p-3 font-mono">"right"</td>
                        <td className="p-3 font-medium">Screen position of launcher button.</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-mono text-[#1a1a1a]">botName</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3 font-medium">Display name in chat header.</td>
                      </tr>
                      <tr className="bg-[#FDF9F0]">
                        <td className="p-3 font-mono text-[#1a1a1a]">welcomeMessage</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">dashboard</td>
                        <td className="p-3 font-medium">First greeting bubble shown to visitor.</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-mono text-[#1a1a1a]">borderRadius</td>
                        <td className="p-3 font-mono text-gray-600">string</td>
                        <td className="p-3 font-mono text-gray-500">theme</td>
                        <td className="p-3 font-medium">Shape: <code>"0px"</code>, <code>"12px"</code>, or <code>"24px"</code>.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: THEMES */}
            {activeTab === "themes" && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#1a1a1a] pb-3">
                  <h1 className="font-syne text-xl sm:text-2xl font-black uppercase text-[#1a1a1a]">
                    Built-in Themes
                  </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: "aptus", name: "Aptus Official", desc: "Signature neo-brutalist: burnt orange (#FF4D00), cream, 3px solid borders.", color: "bg-[#FF4D00]" },
                    { id: "boty", name: "Boty Organic", desc: "Earthy nature palette: warm beige and olive green (#4F5B3A).", color: "bg-[#4F5B3A]" },
                    { id: "chatgpt", name: "ChatGPT Dark", desc: "Charcoal dark mode (#212121) with emerald accents (#10A37F).", color: "bg-[#10A37F]" },
                    { id: "compute", name: "Retro Terminal", desc: "Cyber terminal monospace black-and-cyan aesthetic (#38BDF8).", color: "bg-[#38BDF8]" },
                    { id: "crosshaven", name: "Editorial Luxury", desc: "Refined navy slate and clean royal blue contrast (#2563EB).", color: "bg-[#2563EB]" },
                    { id: "studio", name: "Dark Studio", desc: "Monochrome obsidian with electric yellow (#FFD600).", color: "bg-[#FFD600]" },
                    { id: "energy", name: "Neon Energy", desc: "Vibrant violet and high-impact lime punch (#A3E635).", color: "bg-[#A3E635]" },
                    { id: "smarthome", name: "Emerald Cyan", desc: "Soft aqua cyan with modern smooth curves (#0EA5E9).", color: "bg-[#0EA5E9]" },
                    { id: "superdesign", name: "Pastel Violet", desc: "Deep violet header with soft purple canvas (#8B5CF6).", color: "bg-[#8B5CF6]" },
                    { id: "professional", name: "Corporate Blue", desc: "Enterprise royal blue and crisp white card (#1D4ED8).", color: "bg-[#1D4ED8]" },
                    { id: "github", name: "GitHub Dimmed", desc: "Developer-focused dark slate theme (#F0F6FC).", color: "bg-[#30363D]" },
                    { id: "dracula", name: "Dracula Purple", desc: "Classic dark purple syntax highlight aesthetic (#BD93F9).", color: "bg-[#BD93F9]" },
                    { id: "nord", name: "Nordic Frost", desc: "Arctic cold ice blue with muted dark grays (#88C0D0).", color: "bg-[#88C0D0]" },
                    { id: "cyberpunk", name: "Cyberpunk", desc: "High-voltage neon yellow (#FCEE09) with sharp edges.", color: "bg-[#FCEE09]" },
                  ].map((t) => (
                    <div key={t.id} className="p-3.5 bg-white border-2 border-[#1a1a1a] shadow-neo-sm space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-syne font-black text-xs uppercase text-[#1a1a1a]">{t.name}</span>
                        <span className={`w-3.5 h-3.5 border-2 border-[#1a1a1a] ${t.color}`}></span>
                      </div>
                      <p className="text-gray-700 font-medium leading-snug">{t.desc}</p>
                      <code className="text-[#FF4D00] font-mono text-[11px] font-black block pt-1">
                        theme="{t.id}"
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

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
            © {new Date().getFullYear()} APTUS AI — NPM CHATBOT WIDGET. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
