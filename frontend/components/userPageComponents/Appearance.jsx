"use client";
import React, { useState, useEffect } from "react";
import { Palette, MessageSquare, Check, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const ALL_NPM_THEMES = [
  { id: "aptus", name: "Aptus Official", desc: "Neo-brutalist signature theme with bold borders" },
  { id: "boty", name: "Clean White", desc: "Minimalist modern SaaS white card" },
  { id: "chatgpt", name: "ChatGPT Slate", desc: "Dark charcoal slate with rounded bubbles" },
  { id: "compute", name: "Retro CRT", desc: "Monochrome terminal with green phosphor accent" },
  { id: "crosshaven", name: "Editorial Serif", desc: "Refined luxury serif typography and warm cream" },
  { id: "studio", name: "Studio Purple", desc: "Creative violet glassmorphism accents" },
  { id: "energy", name: "Electric Amber", desc: "High-contrast energetic amber and dark cards" },
  { id: "smarthome", name: "Emerald Tech", desc: "Fresh eco-tech emerald green accents" },
  { id: "superdesign", name: "Neo Pastel", desc: "Soft pastel gradients and playful neo borders" },
  { id: "professional", name: "Corporate Indigo", desc: "Enterprise navy and structured layout" },
  { id: "github", name: "GitHub Dark", desc: "Primer design dark mode with code contrasts" },
  { id: "dracula", name: "Dracula Purple", desc: "Vampire dark mode with purple contrast" },
  { id: "nord", name: "Nord Arctic", desc: "Cool arctic blues and frosty grays" },
  { id: "cyberpunk", name: "Cyberpunk", desc: "High-contrast neon yellow and dark cyber layout" },
];

const PRESET_COLORS = [
  "#f97316",
  "#2563eb",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#1a1a1a",
];

export default function AppearanceTab({ user, onUserUpdate }) {
  const [theme, setTheme] = useState(user?.theme || "aptus");
  const [primaryColor, setPrimaryColor] = useState(user?.primaryColor || "#f97316");
  const [botName, setBotName] = useState(user?.botName || "Aptus AI");
  const [welcomeMessage, setWelcomeMessage] = useState(
    user?.welcomeMessage || "Hello! How can I assist you today?"
  );
  const [allowedDomains, setAllowedDomains] = useState(
    Array.isArray(user?.allowedDomains) ? user.allowedDomains.join(", ") : user?.allowedDomain || ""
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.theme) setTheme(user.theme);
      if (user.primaryColor) setPrimaryColor(user.primaryColor);
      if (user.botName) setBotName(user.botName);
      if (user.welcomeMessage) setWelcomeMessage(user.welcomeMessage);
      if (user.allowedDomains) {
        setAllowedDomains(Array.isArray(user.allowedDomains) ? user.allowedDomains.join(", ") : user.allowedDomains);
      }
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${baseurl}/user/appearance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          theme,
          primaryColor,
          botName,
          welcomeMessage,
          allowedDomains,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Appearance saved!");
        if (onUserUpdate) onUserUpdate();
      } else {
        toast.error(data.message || "Failed to update appearance");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6">
      {/* Header */}
      <div className="border-b-3 border-[#1a1a1a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-2.5 py-0.5 font-black text-xs uppercase inline-block mr-2">
            NPM WIDGET CUSTOMIZER
          </span>
          <h2 className="font-syne text-2xl font-black text-[#1a1a1a] uppercase inline-block">
            Chatbot Appearance
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-5">
          {/* Identity & Welcome */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-[#FDF9F0] flex flex-col gap-3">
            <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#FF4D00]" />
              Chatbot Identity
            </h3>

            <div>
              <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                Bot Name
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Aptus Assistant"
                className="w-full p-2 bg-white border-2 border-[#1a1a1a] text-xs font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                Welcome Message
              </label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={2}
                className="w-full p-2 bg-white border-2 border-[#1a1a1a] text-xs font-medium outline-none resize-none"
                required
              />
            </div>
          </div>

          {/* All 14 NPM Themes Selector */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#2563eb]" />
                Select Theme ({ALL_NPM_THEMES.length} Available)
              </h3>
              <span className="text-[11px] font-mono font-bold uppercase text-gray-500">Active: {theme}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {ALL_NPM_THEMES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-2.5 border-2 border-[#1a1a1a] text-left transition-all ${
                    theme === t.id
                      ? "bg-[#BFF000] shadow-neo-sm font-black"
                      : "bg-[#FDF9F0] hover:bg-white font-bold"
                  }`}
                >
                  <div className="text-xs uppercase flex items-center justify-between">
                    <span className="truncate">{t.name}</span>
                    {theme === t.id && <Check className="w-3.5 h-3.5 shrink-0 text-[#1a1a1a]" />}
                  </div>
                  <div className="text-[10px] text-gray-500 font-normal truncate mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-3">
            <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              Accent Color
            </h3>
            <div className="flex flex-wrap items-center gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-none border-2 border-[#1a1a1a] transition-transform ${
                    primaryColor.toLowerCase() === c.toLowerCase() ? "scale-110 shadow-neo-sm ring-2 ring-black" : "hover:scale-105"
                  }`}
                />
              ))}
              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-7 h-7 cursor-pointer border-2 border-[#1a1a1a] p-0 bg-transparent rounded-none"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 p-1 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-mono font-bold uppercase"
                />
              </div>
            </div>
          </div>

          {/* Whitelisted Domains */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-[#FDF9F0] flex flex-col gap-2">
            <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
              Allowed Domains (Whitelist)
            </h3>
            <input
              type="text"
              value={allowedDomains}
              onChange={(e) => setAllowedDomains(e.target.value)}
              placeholder="e.g. clientwebsite.com, localhost:3000 (comma-separated)"
              className="w-full p-2 bg-white border-2 border-[#1a1a1a] text-xs font-mono font-bold outline-none"
            />
            <span className="text-[10px] text-gray-500 font-medium">Leave empty to allow all domains or for local development testing.</span>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="self-start px-5 py-2.5 bg-[#1a1a1a] text-white font-extrabold text-xs uppercase border-2 border-[#1a1a1a] shadow-neo hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>

        {/* Live Mockup Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] flex flex-col border-3 border-[#1a1a1a] shadow-neo-lg bg-white overflow-hidden">
            {/* Header */}
            <div
              className="p-3 text-white flex items-center justify-between border-b-2 border-[#1a1a1a]"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white text-[#1a1a1a] font-black text-xs flex items-center justify-center border border-[#1a1a1a]">
                  🤖
                </div>
                <div>
                  <h4 className="font-syne font-black text-xs uppercase leading-tight">{botName}</h4>
                  <span className="text-[9px] font-bold opacity-90">● Online</span>
                </div>
              </div>
              <span className="text-[9px] uppercase font-mono px-1 py-0.5 bg-black/40 rounded text-white">
                {theme}
              </span>
            </div>

            {/* Chat Body */}
            <div className="p-3.5 bg-[#FDF9F0] min-h-[200px] flex flex-col gap-2.5 justify-end text-xs">
              <div className="self-start max-w-[85%] p-2 bg-white border-2 border-[#1a1a1a] shadow-neo-sm font-medium text-gray-800 text-[11px]">
                {welcomeMessage}
              </div>

              <div
                className="self-end max-w-[85%] p-2 text-white font-bold border-2 border-[#1a1a1a] shadow-neo-sm text-[11px]"
                style={{ backgroundColor: primaryColor }}
              >
                How do I configure this on my site?
              </div>

              <div className="self-start max-w-[85%] p-2 bg-white border-2 border-[#1a1a1a] shadow-neo-sm font-medium text-gray-800 text-[11px]">
                Install `aptus-ai-chatbot-widget` and pass your token!
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-2 bg-white border-t-2 border-[#1a1a1a] flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Type a message..."
                className="flex-1 text-xs p-1.5 bg-gray-100 border border-gray-300 font-medium outline-none"
              />
              <button
                type="button"
                style={{ backgroundColor: primaryColor }}
                className="px-2.5 py-1 text-white border border-[#1a1a1a] font-bold text-xs"
              >
                Send
              </button>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase mt-2">
            Live Preview ({theme})
          </span>
        </div>
      </div>
    </div>
  );
}
