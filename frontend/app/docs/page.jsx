"use client";

import React, { useState } from "react";
import { ArrowLeft, BookOpen, Terminal, Code, Palette, Settings, Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("intro");
  const [copiedNpm, setCopiedNpm] = useState(false);
  const [copiedYarn, setCopiedYarn] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);

  const usageCode = `import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function App() {
  return (
    <div>
      <h1>My Awesome Website</h1>

      {/* Drop the widget anywhere in your root layout */}
      <ChatBot 
        token="YOUR_BUSINESS_TOKEN" 
        apiUrl="https://aptus-ai-full-stack.vercel.app/api/v1" 
        theme="aptus"
        wantToShowSuggestions={true}
      />
    </div>
  );
}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'npm') {
      setCopiedNpm(true);
      setTimeout(() => setCopiedNpm(false), 2000);
    } else if (type === 'yarn') {
      setCopiedYarn(true);
      setTimeout(() => setCopiedYarn(false), 2000);
    } else if (type === 'usage') {
      setCopiedUsage(true);
      setTimeout(() => setCopiedUsage(false), 2000);
    }
  };

  const sections = [
    { id: "intro", label: "Introduction", icon: BookOpen },
    { id: "install", label: "Installation", icon: Terminal },
    { id: "usage", label: "Quick Start", icon: Code },
    { id: "props", label: "Props API", icon: Settings },
    { id: "themes", label: "Themes", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1a1a1a] font-inter pb-10 md:pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FDF9F0] border-b-4 border-[#1a1a1a] px-4 md:px-6 py-4 flex items-center justify-between shadow-neo-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="font-syne text-lg md:text-xl font-extrabold uppercase tracking-tight">
            Aptus AI <span className="text-[#FF4D00]">Docs</span>
          </h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-10 mt-2 md:mt-4">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border-3 border-[#1a1a1a] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] md:sticky md:top-28 flex flex-col gap-2">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`flex items-center gap-3 px-4 py-3 font-extrabold text-sm uppercase border-2 transition-all ${
                  activeTab === sec.id
                    ? "bg-[#FF4D00] text-white border-[#1a1a1a] translate-x-1 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                    : "bg-[#FDF9F0] text-[#1a1a1a] border-transparent hover:border-[#1a1a1a]"
                }`}
              >
                <sec.icon className="w-4 h-4" />
                {sec.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border-4 border-[#1a1a1a] p-4 md:p-10 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] md:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] min-h-[400px] overflow-hidden">
          {activeTab === "intro" && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h2 className="font-syne text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#1a1a1a] mb-2 break-words">
                Introduction
              </h2>
              
              <div className="pt-2 space-y-6">
                <p className="text-base md:text-lg font-medium leading-relaxed text-gray-800">
                  Welcome to the official documentation for the <strong className="text-[#FF4D00]">Aptus AI Chatbot Widget</strong>. 
                  Our npm package (<code className="bg-[#FDF9F0] border-2 border-[#1a1a1a] px-2 py-1 mx-1 font-mono font-bold text-[#FF4D00] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-sm">aptus-ai-chatbot-widget</code>) allows you to drop a fully trained, intelligent AI assistant into any React or Next.js application in minutes.
                </p>
                
                <div className="bg-[#FDF9F0] border-3 border-[#1a1a1a] p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] mt-6">
                  <h3 className="font-syne font-extrabold text-xl md:text-2xl mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 uppercase">
                    <span className="bg-[#BFF000] border-2 border-[#1a1a1a] text-[#1a1a1a] w-8 h-8 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-sm">✓</span>
                    Why use Aptus?
                  </h3>
                  <ul className="space-y-3 font-medium text-base md:text-lg ml-1 md:ml-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF4D00] font-bold mt-1">→</span>
                      <span><strong>Zero backend setup</strong> required on your end.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF4D00] font-bold mt-1">→</span>
                      <span><strong>Fully customizable</strong> with 14 built-in premium themes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF4D00] font-bold mt-1">→</span>
                      <span><strong>Lightweight</strong> and perfectly optimized for React & Next.js.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF4D00] font-bold mt-1">→</span>
                      <span><strong>Secure authentication</strong> via unique business tokens.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeTab === "install" && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h2 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#1a1a1a] mb-2 break-words">
                Installation
              </h2>
              
              <p className="text-base md:text-lg font-medium text-gray-800">
                Install the widget package via your favorite package manager. It is bundled with zero Tailwind dependencies, meaning it absolutely will not conflict with your existing styles.
              </p>
              
              <div className="bg-[#1a1a1a] rounded-none border-4 border-[#1a1a1a] p-4 md:p-6 relative group shadow-[4px_4px_0px_0px_rgba(255,77,0,1)] mt-6">
                <div className="absolute top-0 left-0 bg-[#FF4D00] text-white text-xs font-extrabold px-3 py-1.5 border-b-2 border-r-2 border-[#1a1a1a] uppercase tracking-wider">NPM</div>
                <pre className="text-[#BFF000] font-mono text-sm md:text-base pt-6 pb-2 overflow-x-auto whitespace-pre-wrap word-break">
                  <code>npm install aptus-ai-chatbot-widget</code>
                </pre>
                <button 
                  onClick={() => copyToClipboard("npm install aptus-ai-chatbot-widget", "npm")}
                  className="absolute top-3 right-3 bg-white p-1.5 md:p-2 border-2 border-[#1a1a1a] hover:bg-[#BFF000] transition-colors shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                >
                  {copiedNpm ? <Check className="w-4 h-4 md:w-5 md:h-5 text-[#1a1a1a]" /> : <Copy className="w-4 h-4 md:w-5 md:h-5 text-[#1a1a1a]" />}
                </button>
              </div>

              <div className="bg-[#1a1a1a] rounded-none border-4 border-[#1a1a1a] p-4 md:p-6 relative group shadow-[4px_4px_0px_0px_rgba(191,240,0,1)] mt-6">
                <div className="absolute top-0 left-0 bg-[#BFF000] text-[#1a1a1a] text-xs font-extrabold px-3 py-1.5 border-b-2 border-r-2 border-[#1a1a1a] uppercase tracking-wider">YARN</div>
                <pre className="text-[#FF4D00] font-mono text-sm md:text-base pt-6 pb-2 overflow-x-auto whitespace-pre-wrap word-break">
                  <code>yarn add aptus-ai-chatbot-widget</code>
                </pre>
                <button 
                  onClick={() => copyToClipboard("yarn add aptus-ai-chatbot-widget", "yarn")}
                  className="absolute top-3 right-3 bg-white p-1.5 md:p-2 border-2 border-[#1a1a1a] hover:bg-[#FF4D00] hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
                >
                  {copiedYarn ? <Check className="w-4 h-4 md:w-5 md:h-5 text-current" /> : <Copy className="w-4 h-4 md:w-5 md:h-5 text-current" />}
                </button>
              </div>
            </section>
          )}

          {activeTab === "usage" && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h2 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#1a1a1a] mb-2 break-words">
                Quick Start
              </h2>
              
              <p className="text-base md:text-lg font-medium text-gray-800">
                Import the <code className="bg-[#FDF9F0] border-2 border-[#1a1a1a] px-2 py-1 mx-1 font-mono font-bold text-[#FF4D00] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-sm">ChatBot</code> component and pass your unique business token to immediately render the floating widget.
              </p>
              
              <div className="bg-[#1a1a1a] rounded-none border-4 border-[#1a1a1a] p-0 relative shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] mt-6 overflow-hidden">
                <div className="bg-white border-b-4 border-[#1a1a1a] px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 border border-black"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400 border border-black"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 border border-black"></div>
                    <span className="ml-2 md:ml-4 font-mono text-xs md:text-sm font-extrabold uppercase tracking-wider text-gray-600">App.jsx</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(usageCode, "usage")}
                    className="bg-[#FDF9F0] p-1.5 md:p-2 border-2 border-[#1a1a1a] hover:bg-[#BFF000] transition-colors shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] flex items-center gap-1 md:gap-2"
                  >
                    {copiedUsage ? <Check className="w-3 h-3 md:w-4 md:h-4 text-[#1a1a1a]" /> : <Copy className="w-3 h-3 md:w-4 md:h-4 text-[#1a1a1a]" />}
                    <span className="text-[10px] md:text-xs font-bold uppercase hidden sm:inline">{copiedUsage ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 md:p-6 overflow-x-auto">
                  <pre className="font-mono text-xs md:text-sm leading-relaxed">
<code className="text-[#FF4D00]">import</code><code className="text-white"> React </code><code className="text-[#FF4D00]">from</code><code className="text-[#BFF000]"> 'react'</code><code className="text-white">;</code>
<br/>
<code className="text-[#FF4D00]">import</code><code className="text-white"> &#123; ChatBot &#125; </code><code className="text-[#FF4D00]">from</code><code className="text-[#BFF000]"> 'aptus-ai-chatbot-widget'</code><code className="text-white">;</code>
<br/><br/>
<code className="text-[#FF4D00]">export default function</code><code className="text-[#BFF000]"> App</code><code className="text-white">() &#123;</code>
<br/>
<code className="text-white">  return (</code>
<br/>
<code className="text-gray-400">    &lt;div&gt;</code>
<br/>
<code className="text-gray-400">      &lt;h1&gt;</code><code className="text-white">My Awesome Website</code><code className="text-gray-400">&lt;/h1&gt;</code>
<br/><br/>
<code className="text-gray-500">      &#123;/* Drop the widget anywhere in your root layout */&#125;</code>
<br/>
<code className="text-[#BFF000]">      &lt;ChatBot </code>
<br/>
<code className="text-[#FF4D00]">        token=</code><code className="text-[#BFF000]">"YOUR_BUSINESS_TOKEN"</code> 
<br/>
<code className="text-[#FF4D00]">        apiUrl=</code><code className="text-[#BFF000]">"https://aptus-ai-full-stack.vercel.app/api/v1"</code> 
<br/>
<code className="text-[#FF4D00]">        theme=</code><code className="text-[#BFF000]">"aptus"</code>
<br/>
<code className="text-[#FF4D00]">        wantToShowSuggestions=</code><code className="text-[#FF4D00]">&#123;true&#125;</code>
<br/>
<code className="text-[#BFF000]">      /&gt;</code>
<br/>
<code className="text-gray-400">    &lt;/div&gt;</code>
<br/>
<code className="text-white">  );</code>
<br/>
<code className="text-white">&#125;</code>
                  </pre>
                </div>
              </div>
              
              <div className="p-4 md:p-5 bg-[#FDF9F0] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] flex items-start gap-3 md:gap-4 mt-6">
                <div className="bg-[#FF4D00] text-white p-1.5 md:p-2 border-2 border-[#1a1a1a] flex-shrink-0">
                  <Settings className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="font-syne font-extrabold text-base md:text-lg uppercase mb-1">Important Note</h4>
                  <p className="font-medium text-gray-800 text-sm md:text-base">
                    Replace <span className="text-[#FF4D00] font-mono font-extrabold">YOUR_BUSINESS_TOKEN</span> with the token found in your Aptus AI dashboard under the "Token" tab.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "props" && (
            <section className="space-y-6 animate-in fade-in duration-500 w-full overflow-hidden">
              <h2 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#1a1a1a] mb-2 break-words">
                Props API Reference
              </h2>
              
              <p className="text-sm md:text-base font-medium text-gray-800 pb-2">
                Configure the widget's behavior, colors, and layout directly via these robust props.
              </p>
              
              <div className="overflow-x-auto border-3 md:border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] bg-white w-full">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-white font-syne text-[10px] md:text-xs tracking-widest">
                      <th className="p-2 md:p-3 border-b-4 border-[#1a1a1a] font-extrabold uppercase whitespace-nowrap">Prop Name</th>
                      <th className="p-2 md:p-3 border-b-4 border-[#1a1a1a] font-extrabold uppercase whitespace-nowrap">Type</th>
                      <th className="p-2 md:p-3 border-b-4 border-[#1a1a1a] font-extrabold uppercase whitespace-nowrap">Default</th>
                      <th className="p-2 md:p-3 border-b-4 border-[#1a1a1a] font-extrabold uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white font-medium text-[11px] md:text-xs">
                    <tr className="border-b-2 border-gray-200 hover:bg-[#FDF9F0] transition-colors">
                      <td className="p-2 md:p-3 font-mono font-extrabold text-[#FF4D00]">token *</td>
                      <td className="p-2 md:p-3 text-gray-600 font-mono">string</td>
                      <td className="p-2 md:p-3 text-gray-400 font-bold">-</td>
                      <td className="p-2 md:p-3 text-gray-800">Required. Your unique business chatbot token to authenticate API calls.</td>
                    </tr>
                    <tr className="border-b-2 border-gray-200 hover:bg-[#FDF9F0] transition-colors">
                      <td className="p-2 md:p-3 font-mono font-extrabold text-[#FF4D00]">apiUrl *</td>
                      <td className="p-2 md:p-3 text-gray-600 font-mono">string</td>
                      <td className="p-2 md:p-3 text-gray-400 font-bold">-</td>
                      <td className="p-2 md:p-3 text-gray-800">Required. The base URL to your Aptus API backend.</td>
                    </tr>
                    <tr className="border-b-2 border-gray-200 hover:bg-[#FDF9F0] transition-colors">
                      <td className="p-2 md:p-3 font-mono font-bold text-[#1a1a1a]">theme</td>
                      <td className="p-2 md:p-3 text-gray-600 font-mono">string</td>
                      <td className="p-2 md:p-3 font-mono">"aptus"</td>
                      <td className="p-2 md:p-3 text-gray-800">Select one of the 14 available design themes. See the Themes tab.</td>
                    </tr>
                    <tr className="border-b-2 border-gray-200 hover:bg-[#FDF9F0] transition-colors">
                      <td className="p-2 md:p-3 font-mono font-bold text-[#1a1a1a]">position</td>
                      <td className="p-2 md:p-3 text-gray-600 font-mono">"left" | "right"</td>
                      <td className="p-2 md:p-3 font-mono">"right"</td>
                      <td className="p-2 md:p-3 text-gray-800">Determines which side of the screen bottom the widget button anchors to.</td>
                    </tr>
                    <tr className="border-b-2 border-gray-200 hover:bg-[#FDF9F0] transition-colors">
                      <td className="p-2 md:p-3 font-mono font-bold text-[#1a1a1a]">wantToShowSuggestions</td>
                      <td className="p-2 md:p-3 text-gray-600 font-mono">boolean</td>
                      <td className="p-2 md:p-3 font-mono text-[#FF4D00]">false</td>
                      <td className="p-2 md:p-3 text-gray-800">Show AI quick-action suggestion chips inside the chat after replies.</td>
                    </tr>
                    <tr className="border-b-2 border-gray-200 hover:bg-[#FDF9F0] transition-colors">
                      <td className="p-2 md:p-3 font-mono font-bold text-[#1a1a1a]">toggleBtnBgColor</td>
                      <td className="p-2 md:p-3 text-gray-600 font-mono">string</td>
                      <td className="p-2 md:p-3 text-gray-500 italic">Theme spec</td>
                      <td className="p-2 md:p-3 text-gray-800">Overrides the default background color of the floating launcher button.</td>
                    </tr>
                    <tr className="hover:bg-[#FDF9F0] transition-colors">
                      <td className="p-2 md:p-3 font-mono font-bold text-[#1a1a1a]">icon</td>
                      <td className="p-2 md:p-3 text-gray-600 font-mono">ReactNode</td>
                      <td className="p-2 md:p-3 text-gray-500 italic">MsgIcon</td>
                      <td className="p-2 md:p-3 text-gray-800">Pass a custom SVG or React Icon component for the toggle button.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "themes" && (
            <section className="space-y-6 animate-in fade-in duration-500">
              <h2 className="font-syne text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#1a1a1a] mb-2 break-words">
                Theming System
              </h2>
              
              <p className="text-base md:text-lg font-medium text-gray-800">
                Pass the <span className="text-[#FF4D00] font-mono font-extrabold">theme</span> prop to instantly apply a comprehensive design system across the entire widget interface.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                {[
                  { id: "aptus", name: "Aptus Official", desc: "Neo-Brutalist Signature", color: "bg-[#FF4D00]", text: "text-white" },
                  { id: "chatgpt", name: "ChatGPT", desc: "Minimal Dark Mode", color: "bg-[#10a37f]", text: "text-white" },
                  { id: "dracula", name: "Dracula", desc: "Official Dracula Palette", color: "bg-[#bd93f9]", text: "text-[#282a36]" },
                  { id: "cyberpunk", name: "Cyberpunk", desc: "2077 Neon Yellow/Cyan", color: "bg-[#fcee0a]", text: "text-black" },
                  { id: "nord", name: "Nord", desc: "Arctic Polar Frost", color: "bg-[#88c0d0]", text: "text-[#2e3440]" },
                  { id: "boty", name: "Boty", desc: "Natural Warm Olive", color: "bg-[#8da36f]", text: "text-white" },
                  { id: "compute", name: "Compute", desc: "Cyber Code Terminal", color: "bg-[#00ff41]", text: "text-black" },
                  { id: "energy", name: "Energy", desc: "Gen-Z Neon Punch", color: "bg-[#ff00ff]", text: "text-white" },
                  { id: "professional", name: "Professional", desc: "Classic Blue Business", color: "bg-[#0f52ba]", text: "text-white" },
                  { id: "github", name: "GitHub", desc: "GitHub Dark Mode", color: "bg-[#24292e]", text: "text-white" },
                  { id: "studio", name: "Studio", desc: "Modern Dark Tool", color: "bg-[#18181a]", text: "text-white" },
                  { id: "crosshaven", name: "Crosshaven", desc: "Corporate Luxury Navy", color: "bg-[#1c2e4a]", text: "text-[#d4af37]" },
                  { id: "smarthome", name: "Smart Home", desc: "Clean Soft Cyan", color: "bg-[#48d1cc]", text: "text-black" },
                  { id: "superdesign", name: "Superdesign", desc: "Creative Purple Violet", color: "bg-[#8a2be2]", text: "text-white" },
                ].map(theme => (
                  <div key={theme.id} className="border-3 md:border-4 border-[#1a1a1a] flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all bg-white group hover:-translate-y-1">
                    <div className={`h-14 md:h-16 border-b-3 md:border-b-4 border-[#1a1a1a] ${theme.color} flex items-center justify-between px-3 md:px-4`}>
                      <span className={`font-syne font-extrabold uppercase tracking-wider text-sm md:text-base ${theme.text}`}>{theme.name}</span>
                      <Palette className={`w-4 h-4 md:w-5 md:h-5 ${theme.text}`} />
                    </div>
                    <div className="p-3 md:p-4 bg-[#FDF9F0] flex-1">
                      <p className="font-medium text-gray-800 text-xs md:text-sm mb-2 md:mb-3">{theme.desc}</p>
                      <div className="font-mono text-xs font-bold text-[#FF4D00]">
                        theme="{theme.id}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
