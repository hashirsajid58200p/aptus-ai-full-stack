"use client";
import React, { useState, useEffect } from "react";
import {
  Palette,
  Bot,
  Sparkles,
  MessageSquare,
  Headphones,
  Brain,
  Cpu,
  Zap,
  Wand2,
  Check,
  RefreshCw,
  ShieldCheck,
  Send,
  Shapes,
  Type,
} from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

export const THEME_CONFIGS = {
  aptus: {
    name: "Aptus Official",
    desc: "Neo-brutalist signature theme with bold 3px borders",
    defaultColor: "#FF4D00",
    containerBg: "#FDF9F0",
    headerBg: "#FF4D00",
    headerColor: "#FFFFFF",
    headerBorderBottom: "3px solid #1a1a1a",
    wrapperBorder: "3px solid #1a1a1a",
    wrapperShadow: "6px 6px 0px #1a1a1a",
    wrapperRadius: "0px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    messagesBg: "#FDF9F0",
    userBubbleBg: "#FF4D00",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "2px solid #1a1a1a",
    botBubbleBg: "#FFFFFF",
    botBubbleColor: "#1A1A1A",
    botBubbleBorder: "2px solid #1a1a1a",
    bubbleRadius: "0px",
    inputBg: "#FFFFFF",
    inputColor: "#1A1A1A",
    inputBorder: "2px solid #1a1a1a",
    inputRadius: "0px",
    buttonBg: "#FF4D00",
    buttonColor: "#FFFFFF",
    buttonBorder: "2px solid #1a1a1a",
    buttonRadius: "0px",
  },
  boty: {
    name: "Boty Organic",
    desc: "Natural warm olive with soft rounded curves",
    defaultColor: "#4F5B3A",
    containerBg: "#F7F4EF",
    headerBg: "#4F5B3A",
    headerColor: "#F7F4EF",
    headerBorderBottom: "1px solid #D8CFC4",
    wrapperBorder: "1px solid #D8CFC4",
    wrapperShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    wrapperRadius: "24px",
    fontFamily: "'Inter', system-ui, sans-serif",
    messagesBg: "#F7F4EF",
    userBubbleBg: "#4F5B3A",
    userBubbleColor: "#F7F4EF",
    userBubbleBorder: "none",
    botBubbleBg: "#EDE6DC",
    botBubbleColor: "#2C2C2C",
    botBubbleBorder: "none",
    bubbleRadius: "18px",
    inputBg: "#FFFFFF",
    inputColor: "#2C2C2C",
    inputBorder: "1px solid #D8CFC4",
    inputRadius: "16px",
    buttonBg: "#4F5B3A",
    buttonColor: "#F7F4EF",
    buttonBorder: "none",
    buttonRadius: "16px",
  },
  chatgpt: {
    name: "ChatGPT Dark",
    desc: "Minimalist dark slate with OpenAI green",
    defaultColor: "#10A37F",
    containerBg: "#212121",
    headerBg: "#2F2F2F",
    headerColor: "#FFFFFF",
    headerBorderBottom: "1px solid #3E3E3E",
    wrapperBorder: "1px solid #3E3E3E",
    wrapperShadow: "0 12px 30px rgba(0, 0, 0, 0.5)",
    wrapperRadius: "12px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    messagesBg: "#212121",
    userBubbleBg: "#2F2F2F",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#171717",
    botBubbleColor: "#ECECEC",
    botBubbleBorder: "none",
    bubbleRadius: "8px",
    inputBg: "#2F2F2F",
    inputColor: "#FFFFFF",
    inputBorder: "1px solid #424242",
    inputRadius: "8px",
    buttonBg: "#10A37F",
    buttonColor: "#FFFFFF",
    buttonBorder: "none",
    buttonRadius: "8px",
  },
  compute: {
    name: "Retro CRT Terminal",
    desc: "Cyber code terminal with cyan phosphor on black",
    defaultColor: "#38BDF8",
    containerBg: "#0C0E12",
    headerBg: "#181C24",
    headerColor: "#38BDF8",
    headerBorderBottom: "1px solid #1E293B",
    wrapperBorder: "1px solid #1E293B",
    wrapperShadow: "0 0 20px rgba(56, 189, 248, 0.2)",
    wrapperRadius: "6px",
    fontFamily: "'JetBrains Mono', monospace",
    messagesBg: "#0C0E12",
    userBubbleBg: "#1E293B",
    userBubbleColor: "#38BDF8",
    userBubbleBorder: "1px solid #38BDF8",
    botBubbleBg: "#181C24",
    botBubbleColor: "#F1F5F9",
    botBubbleBorder: "1px solid #334155",
    bubbleRadius: "6px",
    inputBg: "#111622",
    inputColor: "#F1F5F9",
    inputBorder: "1px solid #334155",
    inputRadius: "4px",
    buttonBg: "#38BDF8",
    buttonColor: "#0C0E12",
    buttonBorder: "none",
    buttonRadius: "4px",
  },
  crosshaven: {
    name: "Editorial Luxury",
    desc: "Refined navy slate and clean contrast",
    defaultColor: "#2563EB",
    containerBg: "#F8FAFC",
    headerBg: "#0F172A",
    headerColor: "#FFFFFF",
    headerBorderBottom: "1px solid #E2E8F0",
    wrapperBorder: "1px solid #E2E8F0",
    wrapperShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.15)",
    wrapperRadius: "10px",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    messagesBg: "#F8FAFC",
    userBubbleBg: "#2563EB",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#E2E8F0",
    botBubbleColor: "#0F172A",
    botBubbleBorder: "none",
    bubbleRadius: "10px",
    inputBg: "#FFFFFF",
    inputColor: "#0F172A",
    inputBorder: "1px solid #CBD5E1",
    inputRadius: "6px",
    buttonBg: "#2563EB",
    buttonColor: "#FFFFFF",
    buttonBorder: "none",
    buttonRadius: "6px",
  },
  studio: {
    name: "Dark Studio",
    desc: "Monochrome obsidian with electric yellow",
    defaultColor: "#FFD600",
    containerBg: "#0A0A0A",
    headerBg: "#1A1A1A",
    headerColor: "#FFD600",
    headerBorderBottom: "1px solid #2D2D2D",
    wrapperBorder: "2px solid #2D2D2D",
    wrapperShadow: "0 12px 30px rgba(0,0,0,0.8)",
    wrapperRadius: "20px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    messagesBg: "#0A0A0A",
    userBubbleBg: "#FF6B35",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#1A1A1A",
    botBubbleColor: "#F5F5F0",
    botBubbleBorder: "1px solid #2D2D2D",
    bubbleRadius: "16px",
    inputBg: "#141414",
    inputColor: "#F5F5F0",
    inputBorder: "1px solid #2D2D2D",
    inputRadius: "24px",
    buttonBg: "#FFD600",
    buttonColor: "#0A0A0A",
    buttonBorder: "none",
    buttonRadius: "24px",
  },
  energy: {
    name: "Neon Energy",
    desc: "Vibrant violet and high-impact lime punch",
    defaultColor: "#A3E635",
    containerBg: "#3B0764",
    headerBg: "#581C87",
    headerColor: "#A3E635",
    headerBorderBottom: "2px solid #581C87",
    wrapperBorder: "2px solid #A3E635",
    wrapperShadow: "0 10px 30px rgba(163, 230, 53, 0.2)",
    wrapperRadius: "12px",
    fontFamily: "'Outfit', system-ui, sans-serif",
    messagesBg: "#3B0764",
    userBubbleBg: "#EC4899",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#581C87",
    botBubbleColor: "#A3E635",
    botBubbleBorder: "none",
    bubbleRadius: "12px",
    inputBg: "#2E1065",
    inputColor: "#FFFFFF",
    inputBorder: "2px solid #EC4899",
    inputRadius: "12px",
    buttonBg: "#EC4899",
    buttonColor: "#FFFFFF",
    buttonBorder: "none",
    buttonRadius: "12px",
  },
  smarthome: {
    name: "Emerald Cyan",
    desc: "Soft aqua cyan with modern smooth curves",
    defaultColor: "#0EA5E9",
    containerBg: "#F0F9FF",
    headerBg: "#0EA5E9",
    headerColor: "#FFFFFF",
    headerBorderBottom: "1px solid #BAE6FD",
    wrapperBorder: "1px solid #BAE6FD",
    wrapperShadow: "0 10px 25px rgba(14, 165, 233, 0.1)",
    wrapperRadius: "24px",
    fontFamily: "'Inter', system-ui, sans-serif",
    messagesBg: "#F0F9FF",
    userBubbleBg: "#0EA5E9",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#E0F2FE",
    botBubbleColor: "#0369A1",
    botBubbleBorder: "none",
    bubbleRadius: "20px",
    inputBg: "#FFFFFF",
    inputColor: "#0F172A",
    inputBorder: "1px solid #BAE6FD",
    inputRadius: "20px",
    buttonBg: "#0EA5E9",
    buttonColor: "#FFFFFF",
    buttonBorder: "none",
    buttonRadius: "20px",
  },
  superdesign: {
    name: "Pastel Violet",
    desc: "Deep violet header with soft purple canvas",
    defaultColor: "#8B5CF6",
    containerBg: "#F3E8FF",
    headerBg: "#4C1D95",
    headerColor: "#FFFFFF",
    headerBorderBottom: "1px solid #DDD6FE",
    wrapperBorder: "1px solid #DDD6FE",
    wrapperShadow: "0 12px 28px rgba(76, 29, 149, 0.15)",
    wrapperRadius: "12px",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    messagesBg: "#F3E8FF",
    userBubbleBg: "#8B5CF6",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#E9D5FF",
    botBubbleColor: "#4C1D95",
    botBubbleBorder: "none",
    bubbleRadius: "12px",
    inputBg: "#FFFFFF",
    inputColor: "#3B0764",
    inputBorder: "1px solid #C4B5FD",
    inputRadius: "8px",
    buttonBg: "#8B5CF6",
    buttonColor: "#FFFFFF",
    buttonBorder: "none",
    buttonRadius: "8px",
  },
  professional: {
    name: "Corporate Blue",
    desc: "Enterprise royal blue and crisp white card",
    defaultColor: "#1D4ED8",
    containerBg: "#FFFFFF",
    headerBg: "#1D4ED8",
    headerColor: "#FFFFFF",
    headerBorderBottom: "1px solid #E2E8F0",
    wrapperBorder: "1px solid #E2E8F0",
    wrapperShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    wrapperRadius: "6px",
    fontFamily: "'Inter', system-ui, sans-serif",
    messagesBg: "#F8FAFC",
    userBubbleBg: "#1D4ED8",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#E2E8F0",
    botBubbleColor: "#0F172A",
    botBubbleBorder: "none",
    bubbleRadius: "6px",
    inputBg: "#F8FAFC",
    inputColor: "#0F172A",
    inputBorder: "1px solid #CBD5E1",
    inputRadius: "4px",
    buttonBg: "#1D4ED8",
    buttonColor: "#FFFFFF",
    buttonBorder: "none",
    buttonRadius: "4px",
  },
  github: {
    name: "GitHub Dark",
    desc: "Primer dark theme with GitHub green accent",
    defaultColor: "#238636",
    containerBg: "#0D1117",
    headerBg: "#161B22",
    headerColor: "#F0F6FC",
    headerBorderBottom: "1px solid #30363D",
    wrapperBorder: "1px solid #30363D",
    wrapperShadow: "0 12px 32px rgba(1, 4, 9, 0.85)",
    wrapperRadius: "6px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    messagesBg: "#0D1117",
    userBubbleBg: "#238636",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "none",
    botBubbleBg: "#161B22",
    botBubbleColor: "#C9D1D9",
    botBubbleBorder: "1px solid #30363D",
    bubbleRadius: "6px",
    inputBg: "#010409",
    inputColor: "#C9D1D9",
    inputBorder: "1px solid #30363D",
    inputRadius: "6px",
    buttonBg: "#238636",
    buttonColor: "#FFFFFF",
    buttonBorder: "none",
    buttonRadius: "6px",
  },
  dracula: {
    name: "Dracula Purple",
    desc: "Official Dracula dark mode with pink & purple",
    defaultColor: "#BD93F9",
    containerBg: "#282A36",
    headerBg: "#6272A4",
    headerColor: "#F8F8F2",
    headerBorderBottom: "1px solid #44475A",
    wrapperBorder: "1px solid #44475A",
    wrapperShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
    wrapperRadius: "16px",
    fontFamily: "'Fira Code', monospace, sans-serif",
    messagesBg: "#282A36",
    userBubbleBg: "#FF79C6",
    userBubbleColor: "#282A36",
    userBubbleBorder: "none",
    botBubbleBg: "#44475A",
    botBubbleColor: "#F8F8F2",
    botBubbleBorder: "none",
    bubbleRadius: "14px",
    inputBg: "#44475A",
    inputColor: "#F8F8F2",
    inputBorder: "1px solid #6272A4",
    inputRadius: "10px",
    buttonBg: "#FF79C6",
    buttonColor: "#282A36",
    buttonBorder: "none",
    buttonRadius: "10px",
  },
  nord: {
    name: "Nord Arctic",
    desc: "Cool polar frost palette with arctic blues",
    defaultColor: "#88C0D0",
    containerBg: "#2E3440",
    headerBg: "#3B4252",
    headerColor: "#88C0D0",
    headerBorderBottom: "1px solid #4C566A",
    wrapperBorder: "1px solid #4C566A",
    wrapperShadow: "0 10px 28px rgba(0, 0, 0, 0.4)",
    wrapperRadius: "8px",
    fontFamily: "'Rubik', system-ui, sans-serif",
    messagesBg: "#2E3440",
    userBubbleBg: "#81A1C1",
    userBubbleColor: "#2E3440",
    userBubbleBorder: "none",
    botBubbleBg: "#3B4252",
    botBubbleColor: "#ECEFF4",
    botBubbleBorder: "none",
    bubbleRadius: "8px",
    inputBg: "#3B4252",
    inputColor: "#ECEFF4",
    inputBorder: "1px solid #4C566A",
    inputRadius: "6px",
    buttonBg: "#88C0D0",
    buttonColor: "#2E3440",
    buttonBorder: "none",
    buttonRadius: "6px",
  },
  cyberpunk: {
    name: "Cyberpunk 2077",
    desc: "Obsidian black with neon yellow & cyan lasers",
    defaultColor: "#FCEE09",
    containerBg: "#050505",
    headerBg: "#FCEE09",
    headerColor: "#050505",
    headerBorderBottom: "2px solid #00F0FF",
    wrapperBorder: "2px solid #FCEE09",
    wrapperShadow: "0 0 25px rgba(0, 240, 255, 0.35)",
    wrapperRadius: "0px",
    fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
    messagesBg: "#050505",
    userBubbleBg: "#FF0055",
    userBubbleColor: "#FFFFFF",
    userBubbleBorder: "1px solid #FCEE09",
    botBubbleBg: "#121212",
    botBubbleColor: "#00F0FF",
    botBubbleBorder: "1px solid #00F0FF",
    bubbleRadius: "0px",
    inputBg: "#121212",
    inputColor: "#FCEE09",
    inputBorder: "1px solid #00F0FF",
    inputRadius: "0px",
    buttonBg: "#FF0055",
    buttonColor: "#FFFFFF",
    buttonBorder: "1px solid #00F0FF",
    buttonRadius: "0px",
  },
};

const PREMADE_AVATARS = [
  { id: "bot", label: "AI Robot", Icon: Bot },
  { id: "sparkles", label: "AI Spark", Icon: Sparkles },
  { id: "chat", label: "Chatbot", Icon: MessageSquare },
  { id: "agent", label: "Live Agent", Icon: Headphones },
  { id: "brain", label: "Neural Brain", Icon: Brain },
  { id: "cpu", label: "AI Core", Icon: Cpu },
  { id: "zap", label: "Turbo Speed", Icon: Zap },
  { id: "wand", label: "Magic AI", Icon: Wand2 },
];

const SHAPE_PRESETS = [
  { id: "0px", label: "Sharp Box", desc: "0px - Neo-Brutalist Sharp Edge", badge: "0px", radiusPreview: "0px" },
  { id: "12px", label: "Mid-Rounded", desc: "12px - Modern Balanced Curves", badge: "12px", radiusPreview: "8px" },
  { id: "24px", label: "Full Pill", desc: "24px - Soft Pill Curves", badge: "24px", radiusPreview: "9999px" },
];

const PRESET_COLORS = [
  "#FF4D00",
  "#2563EB",
  "#10B981",
  "#8B5CF6",
  "#FCEE09",
  "#FF79C6",
  "#1A1A1A",
];

function getContrastColor(hexColor) {
  if (!hexColor || hexColor.startsWith("rgba")) return "#FFFFFF";
  const hex = hexColor.replace("#", "");
  if (hex.length < 6) return "#FFFFFF";
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 145 ? "#111827" : "#FFFFFF";
}

export default function AppearanceTab({ user, onUserUpdate }) {
  const [theme, setTheme] = useState(user?.theme || "aptus");
  const [primaryColor, setPrimaryColor] = useState(user?.primaryColor || "#FF4D00");
  const [hasCustomAccent, setHasCustomAccent] = useState(false);
  const [textColor, setTextColor] = useState(user?.textColor || "");
  const [borderRadius, setBorderRadius] = useState(user?.borderRadius || "");
  const [chatbotAvatar, setChatbotAvatar] = useState(user?.chatbotAvatar || "bot");
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
      if (user.primaryColor) {
        setPrimaryColor(user.primaryColor);
        if (user.primaryColor !== "#FF4D00" && user.primaryColor !== "#f97316") {
          setHasCustomAccent(true);
        }
      }
      if (user.textColor) setTextColor(user.textColor);
      if (user.borderRadius) setBorderRadius(user.borderRadius);
      if (user.chatbotAvatar) setChatbotAvatar(user.chatbotAvatar);
      if (user.botName) setBotName(user.botName);
      if (user.welcomeMessage) setWelcomeMessage(user.welcomeMessage);
      if (user.allowedDomains) {
        setAllowedDomains(Array.isArray(user.allowedDomains) ? user.allowedDomains.join(", ") : user.allowedDomains);
      }
    }
  }, [user]);

  const handleThemeChange = (newThemeKey) => {
    setTheme(newThemeKey);
    const themeDef = THEME_CONFIGS[newThemeKey];
    if (themeDef && !hasCustomAccent) {
      setPrimaryColor(themeDef.defaultColor);
    }
  };

  const handleColorChange = (newColor) => {
    setPrimaryColor(newColor);
    setHasCustomAccent(true);
  };

  const handleResetToThemeColor = () => {
    const themeDef = THEME_CONFIGS[theme];
    if (themeDef) {
      setPrimaryColor(themeDef.defaultColor);
      setHasCustomAccent(false);
      setTextColor("");
      toast.success(`Reset accent to ${themeDef.name} default!`);
    }
  };

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
          textColor,
          borderRadius,
          chatbotAvatar,
          botName,
          welcomeMessage,
          allowedDomains,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Appearance settings updated successfully!");
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

  // Resolve current active theme configuration for the live preview
  const activeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.aptus;
  const effectiveAccent = hasCustomAccent ? primaryColor : activeConfig.defaultColor;
  const effectiveHeaderColor = textColor || getContrastColor(effectiveAccent);
  const effectiveRadius = borderRadius || activeConfig.wrapperRadius;

  const renderAvatarPreview = (size = 18, customColor = null) => {
    const found = PREMADE_AVATARS.find((a) => a.id === chatbotAvatar);
    const colorStyle = customColor ? { color: customColor } : {};

    if (found) {
      const IconComp = found.Icon;
      return <IconComp style={{ width: `${size}px`, height: `${size}px`, ...colorStyle }} />;
    }
    if (chatbotAvatar && (chatbotAvatar.startsWith("http") || chatbotAvatar.startsWith("data:"))) {
      return (
        <img
          src={chatbotAvatar}
          alt="Avatar"
          style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", objectFit: "cover" }}
        />
      );
    }
    return <Bot style={{ width: `${size}px`, height: `${size}px`, ...colorStyle }} />;
  };

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 md:p-6">
      {/* Header */}
      <div className="border-b-3 border-[#1a1a1a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-2.5 py-0.5 font-black text-xs uppercase inline-block mr-2">
            NPM WIDGET CUSTOMIZER
          </span>
          <h2 className="font-syne text-xl md:text-3xl font-black text-[#1a1a1a] uppercase inline-block">
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

          {/* Premade Chatbot Icons Selector */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-3">
            <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#FF4D00]" />
              Select AI Chatbot Avatar Icon
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PREMADE_AVATARS.map((av) => {
                const isSelected = chatbotAvatar === av.id;
                const IconComponent = av.Icon;
                return (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setChatbotAvatar(av.id)}
                    className={`p-2.5 border-2 border-[#1a1a1a] flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-[#BFF000] shadow-neo-sm translate-x-0.5 font-black"
                        : "bg-[#FDF9F0] hover:bg-white font-bold"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center border-2 border-[#1a1a1a] ${
                        isSelected ? "bg-white text-[#1a1a1a]" : "bg-white/80 text-[#1a1a1a]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase font-extrabold truncate">{av.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* All 14 NPM Themes Selector */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#2563EB]" />
                Select Theme (14 Available)
              </h3>
              <span className="text-[11px] font-mono font-bold uppercase text-gray-500">
                Active: {activeConfig.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {Object.entries(THEME_CONFIGS).map(([key, t]) => {
                const isSelected = theme === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`p-2.5 border-2 border-[#1a1a1a] text-left transition-all ${
                      isSelected
                        ? "bg-[#BFF000] shadow-neo-sm font-black translate-x-0.5"
                        : "bg-[#FDF9F0] hover:bg-white font-bold"
                    }`}
                  >
                    <div className="text-xs uppercase flex items-center justify-between">
                      <span className="truncate">{t.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-[#1a1a1a] inline-block"
                          style={{ backgroundColor: t.defaultColor }}
                        />
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#1a1a1a]" />}
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-600 font-normal truncate mt-0.5">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shape & Corner Radius Customization */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
                <Shapes className="w-4 h-4 text-[#8B5CF6]" />
                Widget Shape & Rounded Corners
              </h3>
              {borderRadius && (
                <button
                  type="button"
                  onClick={() => setBorderRadius("")}
                  className="text-[10px] font-bold text-[#2563eb] hover:underline"
                >
                  Use Theme Default
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {SHAPE_PRESETS.map((shape) => {
                const isSelected = borderRadius === shape.id;
                return (
                  <button
                    type="button"
                    key={shape.id}
                    onClick={() => setBorderRadius(shape.id)}
                    className={`p-3 border-2 border-[#1a1a1a] text-center transition-all ${
                      isSelected
                        ? "bg-[#BFF000] shadow-neo-sm font-black translate-x-0.5"
                        : "bg-[#FDF9F0] hover:bg-white font-bold"
                    }`}
                  >
                    <div
                      className="w-7 h-7 mx-auto mb-1.5 border-2 border-[#1a1a1a] bg-white transition-all shadow-sm"
                      style={{
                        borderRadius: shape.radiusPreview,
                      }}
                    />
                    <div className="text-xs uppercase font-extrabold">{shape.label}</div>
                    <div className="text-[10px] text-gray-500 font-normal mt-0.5">{shape.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Customization (Primary Accent & Text Color) */}
          <div className="border-2 border-[#1a1a1a] p-4 bg-white flex flex-col gap-4">
            {/* Primary Accent */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#10b981]" />
                  Primary Accent Color
                </h3>
                {hasCustomAccent && (
                  <button
                    type="button"
                    onClick={handleResetToThemeColor}
                    className="text-[10px] font-bold text-[#2563eb] hover:underline"
                  >
                    Reset to theme default
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => handleColorChange(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 border-2 border-[#1a1a1a] transition-transform ${
                      effectiveAccent.toLowerCase() === c.toLowerCase()
                        ? "scale-110 shadow-neo-sm ring-2 ring-black"
                        : "hover:scale-105"
                    }`}
                  />
                ))}
                <div className="flex items-center gap-1.5 ml-2">
                  <input
                    type="color"
                    value={effectiveAccent}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-7 h-7 cursor-pointer border-2 border-[#1a1a1a] p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={effectiveAccent}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-20 p-1 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-mono font-bold uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Header Text Color */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-syne text-xs font-black uppercase text-[#1a1a1a] flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#2563EB]" />
                  Header Text Color
                </h3>
                {textColor && (
                  <button
                    type="button"
                    onClick={() => setTextColor("")}
                    className="text-[10px] font-bold text-[#2563eb] hover:underline"
                  >
                    Auto Contrast
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={effectiveHeaderColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-7 h-7 cursor-pointer border-2 border-[#1a1a1a] p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={textColor || effectiveHeaderColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="e.g. #FFFFFF"
                  className="w-28 p-1.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-mono font-bold uppercase"
                />
                <span className="text-[11px] text-gray-500">
                  {textColor ? "Custom Text Color" : "Auto-calculated for high contrast"}
                </span>
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
              placeholder="e.g. mywebsite.com, localhost:3000 (comma-separated)"
              className="w-full p-2 bg-white border-2 border-[#1a1a1a] text-xs font-mono font-bold outline-none"
            />
            <span className="text-[10px] text-gray-500 font-medium">
              Leave blank to allow all domains or for local development.
            </span>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="self-start px-6 py-2.5 bg-[#1a1a1a] text-white font-extrabold text-xs uppercase border-2 border-[#1a1a1a] shadow-neo hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {saving ? "Saving Changes..." : "Save Appearance Settings"}
          </button>
        </form>

        {/* Dedicated Framed Live Mockup Preview Container */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo-lg flex flex-col overflow-hidden">
            {/* Window title bar */}
            <div className="bg-[#262626] border-b-2 border-[#1a1a1a] px-3.5 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
                <span className="text-[10px] font-mono font-bold text-gray-300 uppercase ml-2 tracking-wider">
                  Live Preview Container
                </span>
              </div>
              <span className="bg-[#BFF000] text-[#1a1a1a] text-[9px] font-mono font-black uppercase px-2 py-0.5 border border-[#1a1a1a]">
                {activeConfig.name}
              </span>
            </div>

            {/* Container canvas where the interactive chatbot widget sits */}
            <div className="p-4 sm:p-6 bg-[#F5F2EB] flex flex-col items-center justify-center min-h-[500px]">
              <div
                className="w-full max-w-[320px] flex flex-col transition-all duration-200 overflow-hidden"
                style={{
                  backgroundColor: activeConfig.containerBg,
                  border: activeConfig.wrapperBorder || "1px solid #e5e7eb",
                  borderRadius: effectiveRadius || "0px",
                  boxShadow: activeConfig.wrapperShadow || "0 10px 25px rgba(0,0,0,0.1)",
                  fontFamily: activeConfig.fontFamily,
                }}
              >
                {/* Header */}
                <div
                  className="p-3.5 flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor: effectiveAccent,
                    color: effectiveHeaderColor,
                    borderBottom: activeConfig.headerBorderBottom || "none",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        color: effectiveHeaderColor,
                      }}
                    >
                      {renderAvatarPreview(16, effectiveHeaderColor)}
                    </div>
                    <div>
                      <h4
                        className="font-extrabold text-xs uppercase leading-tight tracking-wide"
                        style={{ color: effectiveHeaderColor }}
                      >
                        {botName}
                      </h4>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: effectiveHeaderColor, opacity: 0.85 }}
                      >
                        ● Online
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded opacity-90"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.25)",
                      color: effectiveHeaderColor,
                    }}
                  >
                    {theme}
                  </span>
                </div>

                {/* Chat Body */}
                <div
                  className="p-3.5 min-h-[220px] flex flex-col gap-2.5 justify-end text-xs transition-colors"
                  style={{ backgroundColor: activeConfig.messagesBg }}
                >
                  {/* Bot Greeting Bubble */}
                  <div
                    className="self-start max-w-[85%] p-2.5 text-[11px] font-medium leading-relaxed"
                    style={{
                      backgroundColor: activeConfig.botBubbleBg,
                      color: activeConfig.botBubbleColor,
                      border: activeConfig.botBubbleBorder || "none",
                      borderRadius: effectiveRadius === "0px" ? "0px" : activeConfig.bubbleRadius || "8px",
                    }}
                  >
                    {welcomeMessage}
                  </div>

                  {/* User Bubble */}
                  <div
                    className="self-end max-w-[85%] p-2.5 text-[11px] font-semibold leading-relaxed"
                    style={{
                      backgroundColor: effectiveAccent,
                      color: effectiveHeaderColor,
                      border: activeConfig.userBubbleBorder || "none",
                      borderRadius: effectiveRadius === "0px" ? "0px" : activeConfig.bubbleRadius || "8px",
                    }}
                  >
                    How do I integrate this on my website?
                  </div>

                  {/* Bot Answer Bubble */}
                  <div
                    className="self-start max-w-[85%] p-2.5 text-[11px] font-medium leading-relaxed"
                    style={{
                      backgroundColor: activeConfig.botBubbleBg,
                      color: activeConfig.botBubbleColor,
                      border: activeConfig.botBubbleBorder || "none",
                      borderRadius: effectiveRadius === "0px" ? "0px" : activeConfig.bubbleRadius || "8px",
                    }}
                  >
                    Install <code className="font-mono text-[10px] opacity-90">aptus-ai-chatbot-widget</code> and pass your token!
                  </div>
                </div>

                {/* Input Bar */}
                <div
                  className="p-2.5 flex items-center gap-2"
                  style={{
                    backgroundColor: activeConfig.containerBg,
                    borderTop: activeConfig.headerBorderBottom || "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <input
                    type="text"
                    disabled
                    placeholder="Type a message or use voice..."
                    className="flex-1 text-xs p-2 outline-none"
                    style={{
                      backgroundColor: activeConfig.inputBg,
                      color: activeConfig.inputColor,
                      border: activeConfig.inputBorder || "1px solid #ccc",
                      borderRadius: effectiveRadius === "0px" ? "0px" : activeConfig.inputRadius || "4px",
                    }}
                  />
                  <button
                    type="button"
                    className="p-2 text-xs font-bold flex items-center justify-center transition-opacity"
                    style={{
                      backgroundColor: effectiveAccent,
                      color: effectiveHeaderColor,
                      border: activeConfig.buttonBorder || "none",
                      borderRadius: effectiveRadius === "0px" ? "0px" : activeConfig.buttonRadius || "4px",
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Floating Toggle Button Preview under the widget */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-500">
                  Toggle Button Preview:
                </span>
                <div
                  className="w-11 h-11 flex items-center justify-center border-2 border-[#1a1a1a] shadow-neo-sm"
                  style={{
                    backgroundColor: effectiveAccent,
                    color: effectiveHeaderColor,
                    borderRadius: effectiveRadius || "50%",
                  }}
                >
                  {renderAvatarPreview(22, effectiveHeaderColor)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
