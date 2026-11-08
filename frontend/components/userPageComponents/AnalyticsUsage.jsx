"use client";
import React, { useState, useEffect } from "react";
import { Cpu, Key, RefreshCw, BarChart3, Globe, ShieldCheck } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const PROVIDERS = [
  { id: "groq", name: "Groq", desc: "Ultra-fast Llama & GPT OSS models" },
  { id: "openai", name: "OpenAI", desc: "GPT-4o, GPT-4o Mini, o1" },
  { id: "anthropic", name: "Anthropic Claude", desc: "Claude 3.5 Sonnet & Haiku" },
  { id: "xai", name: "xAI Grok", desc: "Grok 2 & Grok Beta" },
  { id: "openrouter", name: "OpenRouter", desc: "Multi-provider AI routing" },
  { id: "custom", name: "Custom API", desc: "Any OpenAI-compatible endpoint" },
];

export default function AnalyticsUsage({ user, onUserUpdate }) {
  const [provider, setProvider] = useState(user?.provider || "groq");
  const [modelName, setModelName] = useState(user?.modelName || "openai/gpt-oss-120b");
  const [groqKey, setGroqKey] = useState(user?.groqApiKey || "");
  const [openaiKey, setOpenaiKey] = useState(user?.openaiApiKey || "");
  const [anthropicKey, setAnthropicKey] = useState(user?.anthropicApiKey || "");
  const [xaiKey, setXaiKey] = useState(user?.xaiApiKey || "");
  const [openrouterKey, setOpenrouterKey] = useState(user?.openrouterApiKey || "");
  const [customKey, setCustomKey] = useState(user?.customApiKey || "");
  const [customBaseUrl, setCustomBaseUrl] = useState(user?.customBaseUrl || "");

  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isManualModel, setIsManualModel] = useState(false);

  const totalUsed = user?.tokenUsage?.totalTokens || 0;
  const tokenLimit = user?.tokenLimit || 500000;
  const percentage = Math.min(100, Math.round((totalUsed / tokenLimit) * 100));
  const dailyStats = user?.tokenUsage?.dailyUsage || [];

  const getKeyForProvider = (prov) => {
    switch (prov) {
      case "openai": return openaiKey;
      case "anthropic": return anthropicKey;
      case "xai": return xaiKey;
      case "openrouter": return openrouterKey;
      case "custom": return customKey;
      case "groq":
      default: return groqKey;
    }
  };

  const fetchModels = async (prov = provider, keyOverride = null, urlOverride = null) => {
    setLoadingModels(true);
    try {
      const activeKey = keyOverride !== null ? keyOverride : getKeyForProvider(prov);
      const activeUrl = urlOverride !== null ? urlOverride : customBaseUrl;

      const url = new URL(`${baseurl}/user/models`);
      url.searchParams.set("provider", prov);
      if (activeKey) url.searchParams.set("apiKey", activeKey);
      if (prov === "custom" && activeUrl) url.searchParams.set("customBaseUrl", activeUrl);

      const res = await fetch(url.toString(), { credentials: "include" });
      const data = await res.json();

      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        setAvailableModels(data.models);
        if (!data.models.some((m) => m.id === modelName)) {
          setModelName(data.models[0].id);
        }
      } else {
        setAvailableModels([]);
      }
    } catch (err) {
      console.warn("Could not fetch models:", err.message);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModels(provider);
  }, [provider]);

  const handleProviderSelect = (newProv) => {
    setProvider(newProv);
    fetchModels(newProv, getKeyForProvider(newProv));
  };

  const handleSaveModel = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${baseurl}/chatbot/model-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          provider,
          modelName,
          groqApiKey: groqKey || undefined,
          openaiApiKey: openaiKey || undefined,
          anthropicApiKey: anthropicKey || undefined,
          xaiApiKey: xaiKey || undefined,
          openrouterApiKey: openrouterKey || undefined,
          customApiKey: customKey || undefined,
          customBaseUrl: customBaseUrl || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("AI Model configuration updated successfully!");
        if (onUserUpdate) onUserUpdate();
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 md:p-6">
      {/* Header */}
      <div className="border-b-3 border-[#1a1a1a] pb-4">
        <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
          ENGINE CONFIG
        </span>
        <h2 className="font-syne text-xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block">
          AI Model & Analytics
        </h2>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase text-gray-600">Tokens Consumed</span>
          <span className="font-syne text-2xl font-black text-[#1a1a1a]">{totalUsed.toLocaleString()}</span>
          <div className="w-full bg-gray-200 h-3 border border-[#1a1a1a] overflow-hidden mt-1">
            <div
              className={`h-full ${percentage > 85 ? "bg-red-500" : "bg-[#BFF000]"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-gray-500">{percentage}% of monthly limit</span>
        </div>

        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase text-gray-600">Monthly Limit</span>
          <span className="font-syne text-2xl font-black text-[#1a1a1a]">{tokenLimit.toLocaleString()}</span>
          <span className="text-xs text-gray-500 font-medium">Assigned by Administrator</span>
        </div>

        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase text-gray-600">Active Engine</span>
          <span className="font-syne text-xl font-black text-[#FF4D00] uppercase truncate">
            {PROVIDERS.find((p) => p.id === provider)?.name || provider}
          </span>
          <span className="text-xs text-gray-700 font-bold truncate">Model: {modelName}</span>
        </div>
      </div>

      {/* Engine & Provider Settings */}
      <div className="border-2 border-[#1a1a1a] p-4 md:p-6 bg-white">
        <h3 className="font-syne text-base md:text-lg font-black uppercase text-[#1a1a1a] mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#FF4D00]" />
          Select LLM Provider
        </h3>

        {/* Provider Buttons Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {PROVIDERS.map((p) => {
            const isSelected = provider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderSelect(p.id)}
                className={`p-3 border-2 border-[#1a1a1a] text-left transition-all duration-150 ${
                  isSelected
                    ? "bg-[#BFF000] text-[#1a1a1a] shadow-neo-sm translate-x-0.5"
                    : "bg-white text-[#1a1a1a] hover:bg-[#FDF9F0]"
                }`}
              >
                <div className="font-syne font-black text-xs md:text-sm uppercase">{p.name}</div>
                <div className="text-[11px] text-gray-600 truncate mt-0.5">{p.desc}</div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSaveModel} className="flex flex-col gap-5 max-w-2xl">
          {/* Provider Specific Inputs */}
          {provider === "groq" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                  Groq API Key (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => fetchModels("groq", groqKey)}
                  className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                  Refresh Models
                </button>
              </div>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                onBlur={() => fetchModels("groq", groqKey)}
                placeholder="gsk_... (Leave empty to use system key)"
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Leave blank to use platform Groq key, or enter your personal key.
              </span>
            </div>
          )}

          {provider === "openai" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                  OpenAI API Key
                </label>
                <button
                  type="button"
                  onClick={() => fetchModels("openai", openaiKey)}
                  className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                  Refresh Models
                </button>
              </div>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                onBlur={() => fetchModels("openai", openaiKey)}
                placeholder="sk-proj-..."
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
              />
            </div>
          )}

          {provider === "anthropic" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                  Anthropic API Key
                </label>
                <button
                  type="button"
                  onClick={() => fetchModels("anthropic", anthropicKey)}
                  className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                  Refresh Models
                </button>
              </div>
              <input
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                onBlur={() => fetchModels("anthropic", anthropicKey)}
                placeholder="sk-ant-..."
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
              />
            </div>
          )}

          {provider === "xai" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                  xAI API Key
                </label>
                <button
                  type="button"
                  onClick={() => fetchModels("xai", xaiKey)}
                  className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                  Refresh Models
                </button>
              </div>
              <input
                type="password"
                value={xaiKey}
                onChange={(e) => setXaiKey(e.target.value)}
                onBlur={() => fetchModels("xai", xaiKey)}
                placeholder="xai-..."
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
              />
            </div>
          )}

          {provider === "openrouter" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                  OpenRouter API Key
                </label>
                <button
                  type="button"
                  onClick={() => fetchModels("openrouter", openrouterKey)}
                  className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                  Refresh Models
                </button>
              </div>
              <input
                type="password"
                value={openrouterKey}
                onChange={(e) => setOpenrouterKey(e.target.value)}
                onBlur={() => fetchModels("openrouter", openrouterKey)}
                placeholder="sk-or-v1-..."
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
              />
            </div>
          )}

          {provider === "custom" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">
                  Custom Base URL (OpenAI-Compatible)
                </label>
                <input
                  type="url"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  onBlur={() => fetchModels("custom", customKey, customBaseUrl)}
                  placeholder="https://api.together.xyz/v1 or http://localhost:11434/v1"
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                    API Key / Bearer Token
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("custom", customKey, customBaseUrl)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Refresh Models
                  </button>
                </div>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  onBlur={() => fetchModels("custom", customKey, customBaseUrl)}
                  placeholder="Bearer token (or dummy-key if local)"
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
              </div>
            </div>
          )}

          {/* Model Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                AI Model {loadingModels ? "(Fetching accessible models...)" : ""}
              </label>
              <button
                type="button"
                onClick={() => setIsManualModel(!isManualModel)}
                className="text-[11px] font-bold text-gray-600 hover:text-black underline"
              >
                {isManualModel ? "Select from list" : "Enter custom model ID"}
              </button>
            </div>

            {isManualModel || availableModels.length === 0 ? (
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. openai/gpt-oss-120b, gpt-4o, claude-3-5-sonnet-20241022"
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono font-bold outline-none"
                required
              />
            ) : (
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-bold outline-none cursor-pointer"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.id}
                  </option>
                ))}
              </select>
            )}
            <span className="text-[11px] text-gray-500 mt-1 block">
              This model will generate answers for all incoming chatbot interactions.
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="self-start px-6 py-2.5 bg-[#1a1a1a] text-white font-extrabold text-xs uppercase border-2 border-[#1a1a1a] shadow-neo hover:bg-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save AI Model Settings"}
          </button>
        </form>
      </div>

      {/* Daily Consumption History */}
      <div className="border-2 border-[#1a1a1a] p-4 bg-white">
        <h4 className="font-syne text-xs md:text-sm font-extrabold uppercase text-[#1a1a1a] mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#FF4D00]" />
          Recent Daily Token Usage
        </h4>
        {dailyStats.length === 0 ? (
          <p className="text-xs text-gray-500">No token activity recorded in the current billing cycle yet.</p>
        ) : (
          <div className="space-y-2">
            {dailyStats.slice(-7).reverse().map((day, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-[#FDF9F0] border border-[#1a1a1a]">
                <span className="font-mono font-bold text-gray-700">{day.date}</span>
                <span className="font-black text-[#1a1a1a]">{day.tokens.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
