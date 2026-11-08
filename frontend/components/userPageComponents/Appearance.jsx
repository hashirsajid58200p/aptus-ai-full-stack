"use client";
import React, { useState, useEffect } from "react";
import { Palette, Globe, MessageSquare, Check, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const THEMES = [
  { id: "aptus", name: "Aptus Neo-Brutalism", desc: "Bold black borders, vibrant accents" },
  { id: "boty", name: "Modern Clean White", desc: "Minimalist, sleek, modern SaaS style" },
  { id: "professional", name: "Professional Corporate", desc: "Clean indigo/slate enterprise layout" },
  { id: "dracula", name: "Dracula Dark", desc: "Deep dark theme with purple contrasts" },
  { id: "nord", name: "Nord Arctic", desc: "Cool arctic blues and frosty grays" },
  { id: "cyberpunk", name: "Cyberpunk High-Tech", desc: "Neon yellow and sharp cyber borders" },
];

const PRESET_COLORS = [
  "#f97316", // Orange
  "#2563eb", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#000000", // Sleek Black
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
        toast.success("Appearance & Domain settings saved!");
        if (onUserUpdate) onUserUpdate();
      } else {
        toast.error(data.message || "Failed to update appearance settings");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6">
      {/* Header */}
      <div className="border-b-3 border-[#1a1a1a] pb-4">
        <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
          ZERO-CONFIG WIDGET
        </span>
        <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block">
          Chatbot Appearance & Security
        </h2>
        <p className="text-xs text-gray-600 mt-2">
          Configure your chatbot&apos;s live theme, branding, colors, and domain whitelist. All changes reflect instantly on your client websites without republishing or touching code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-6">
          {/* Bot Name & Welcome Message */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-[#FDF9F0] flex flex-col gap-4">
            <h3 className="font-syne text-sm font-extrabold uppercase text-[#1a1a1a] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#f97316]" />
              Bot Identity & Greeting
            </h3>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">
                Chatbot Display Name
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="e.g. Acme Support Assistant"
                className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-sm font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">
                Welcome Message
              </label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={2}
                placeholder="Initial message displayed when the chat opens"
                className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-sm font-medium outline-none resize-none"
                required
              />
            </div>
          </div>

          {/* Theme Selection */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-3">
            <h3 className="font-syne text-sm font-extrabold uppercase text-[#1a1a1a] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#2563eb]" />
              Choose Widget Theme
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 border-2 border-[#1a1a1a] text-left transition-all ${
                    theme === t.id
                      ? "bg-[#BFF000] shadow-neo-sm font-black"
                      : "bg-[#FDF9F0] hover:bg-white font-bold"
                  }`}
                >
                  <div className="text-xs uppercase flex items-center justify-between">
                    <span>{t.name}</span>
                    {theme === t.id && <Check className="w-4 h-4 text-[#1a1a1a]" />}
                  </div>
                  <div className="text-[10px] text-gray-600 font-normal mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Accent Color */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-3">
            <h3 className="font-syne text-sm font-extrabold uppercase text-[#1a1a1a] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              Primary Accent Color
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full border-2 border-[#1a1a1a] transition-transform ${
                    primaryColor.toLowerCase() === c.toLowerCase() ? "scale-125 shadow-neo-sm ring-2 ring-black" : "hover:scale-110"
                  }`}
                />
              ))}
              <div className="flex items-center gap-2 ml-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 cursor-pointer border-2 border-[#1a1a1a] p-0 bg-transparent rounded-none"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-24 p-1.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-mono font-bold uppercase"
                />
              </div>
            </div>
          </div>

          {/* Whitelisted Domains (Security Shield) */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-[#FDF9F0] flex flex-col gap-3">
            <h3 className="font-syne text-sm font-extrabold uppercase text-[#1a1a1a] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
              Domain Whitelist (Origin Protection)
            </h3>
            <p className="text-xs text-gray-600">
              Protect your token against unauthorized use. Enter the domains allowed to embed this chatbot (comma-separated). Leave empty during testing to allow all origins.
            </p>
            <input
              type="text"
              value={allowedDomains}
              onChange={(e) => setAllowedDomains(e.target.value)}
              placeholder="e.g. mycompany.com, app.mycompany.com, localhost:3000"
              className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-xs font-mono font-bold outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="self-start px-6 py-3 bg-[#1a1a1a] text-white font-extrabold text-xs uppercase border-2 border-[#1a1a1a] shadow-neo hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Saving Changes..." : "Save Appearance & Security"}
          </button>
        </form>

        {/* Live Mockup Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] flex flex-col border-3 border-[#1a1a1a] shadow-neo-lg bg-white overflow-hidden">
            {/* Header */}
            <div
              className="p-3 text-white flex items-center justify-between border-b-2 border-[#1a1a1a]"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white text-[#1a1a1a] font-black text-xs flex items-center justify-center border border-[#1a1a1a]">
                  🤖
                </div>
                <div>
                  <h4 className="font-syne font-black text-xs uppercase leading-tight">{botName}</h4>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BFF000] animate-pulse"></span>
                    <span className="text-[9px] font-bold opacity-90">Online</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-black/30 rounded">
                {theme}
              </span>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-[#FDF9F0] min-h-[220px] flex flex-col gap-3 justify-end text-xs">
              <div className="self-start max-w-[85%] p-2.5 bg-white border-2 border-[#1a1a1a] shadow-neo-sm rounded-lg font-medium text-gray-800">
                {welcomeMessage}
              </div>

              <div
                className="self-end max-w-[85%] p-2.5 text-white font-bold border-2 border-[#1a1a1a] shadow-neo-sm rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Can you tell me about your pricing plans?
              </div>

              <div className="self-start max-w-[85%] p-2.5 bg-white border-2 border-[#1a1a1a] shadow-neo-sm rounded-lg font-medium text-gray-800">
                We offer starter and enterprise plans with a 30-day money-back guarantee!
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-2.5 bg-white border-t-2 border-[#1a1a1a] flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Ask a question..."
                className="flex-1 text-xs p-1.5 bg-gray-100 border border-gray-300 rounded font-medium outline-none"
              />
              <button
                type="button"
                style={{ backgroundColor: primaryColor }}
                className="p-1.5 text-white border border-[#1a1a1a] rounded font-bold text-xs"
              >
                Send
              </button>
            </div>
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase mt-2">
            Live Preview (Updates Instantly on Client Sites)
          </span>
        </div>
      </div>
    </div>
  );
}
