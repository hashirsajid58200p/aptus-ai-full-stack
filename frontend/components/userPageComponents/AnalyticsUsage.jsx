"use client";
import React, { useState, useEffect } from "react";
import { Cpu, Key, RefreshCw, CheckCircle2, ShieldCheck, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const PROVIDERS = [
  { id: "groq", name: "Groq", desc: "Ultra-fast Llama & open models (Fastest Latency)", badge: "Free/Fast" },
  { id: "openai", name: "OpenAI", desc: "GPT-4o, GPT-4o Mini, o1 reasoning", badge: "Industry Std" },
  { id: "anthropic", name: "Anthropic Claude", desc: "Claude 3.5 Sonnet & Haiku", badge: "High Nuance" },
  { id: "xai", name: "xAI Grok", desc: "Grok 2 & Grok Beta real-time AI", badge: "xAI" },
  { id: "openrouter", name: "OpenRouter", desc: "Unified multi-provider AI gateway", badge: "Multi-Model" },
  { id: "custom", name: "Custom API", desc: "Self-hosted vLLM, Ollama, or OpenAI proxy", badge: "Self-Hosted" },
];

export const CURATED_MODELS = {
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", badge: "Recommended", desc: "128k context, top conversational intelligence & ultra fast" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", badge: "Ultra Fast", desc: "Lowest latency response for quick customer FAQs" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B (32k)", badge: "Balanced", desc: "High throughput reasoning with extended memory" },
    { id: "gemma2-9b-it", name: "Gemma 2 9B", badge: "Google", desc: "Compact Google instruction model" },
    { id: "openai/gpt-oss-120b", name: "GPT OSS 120B", badge: "Platform Default", desc: "Aptus default high-capacity open-weight system" },
  ],
  openai: [
    { id: "gpt-4o", name: "GPT-4o", badge: "Flagship", desc: "Omni model for complex customer conversations" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", badge: "Cost Efficient", desc: "Fast, smart, near-zero token cost" },
    { id: "o1-mini", name: "o1-mini", badge: "Deep Reasoning", desc: "STEM and technical troubleshooting multi-step reasoning" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", badge: "128k Context", desc: "Large context window for extensive docs" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", badge: "Top Quality", desc: "Industry benchmark for natural, highly persuasive conversations" },
    { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", badge: "Speed", desc: "Instant response times with excellent instruction following" },
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus", badge: "Analysis", desc: "Deep multi-domain complex customer synthesis" },
  ],
  xai: [
    { id: "grok-2-1212", name: "Grok 2", badge: "Flagship", desc: "State-of-the-art conversational model by xAI" },
    { id: "grok-beta", name: "Grok Beta", badge: "Speed", desc: "Fast preview model for interactive responses" },
  ],
  openrouter: [
    { id: "deepseek/deepseek-r1", name: "DeepSeek R1", badge: "Reasoning", desc: "State of the art open reasoning model" },
    { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", badge: "Versatile", desc: "Meta flagship weights hosted via OpenRouter" },
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", badge: "Top Tier", desc: "High nuance customer service" },
    { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", badge: "Economy", desc: "Low cost routed intelligence" },
  ],
  custom: [
    { id: "default", name: "Default Self-Hosted Model", badge: "Custom", desc: "Custom model provided by your base URL endpoint" },
  ],
};

export default function AnalyticsUsage({ user, onUserUpdate }) {
  const [provider, setProvider] = useState(user?.provider || "groq");
  const [modelName, setModelName] = useState(user?.modelName || "llama-3.3-70b-versatile");
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
      } else {
        // Fallback to rich curated list
        setAvailableModels(CURATED_MODELS[prov] || []);
      }
    } catch (err) {
      console.warn("Could not fetch models:", err.message);
      setAvailableModels(CURATED_MODELS[prov] || []);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModels(provider);
  }, [provider]);

  const handleProviderSelect = (newProv) => {
    setProvider(newProv);
    const curated = CURATED_MODELS[newProv] || [];
    setAvailableModels(curated);
    if (curated.length > 0) {
      setModelName(curated[0].id);
    }
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

  const currentModels = availableModels.length > 0 ? availableModels : (CURATED_MODELS[provider] || []);

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 md:p-6">
      {/* Header */}
      <div className="border-b-3 border-[#1a1a1a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
            LLM CONFIGURATION
          </span>
          <h2 className="font-syne text-xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block mt-1 sm:mt-0">
            AI Engine & Provider Keys
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-gray-500">Active:</span>
          <span className="px-2.5 py-1 bg-[#2D31FA] text-white border-2 border-[#1a1a1a] font-mono font-bold text-xs">
            {provider.toUpperCase()} / {modelName}
          </span>
        </div>
      </div>

      {/* Select Provider Grid */}
      <div className="border-2 border-[#1a1a1a] p-4 md:p-6 bg-white">
        <h3 className="font-syne text-sm md:text-base font-black uppercase text-[#1a1a1a] mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#FF4D00]" />
          Step 1: Choose LLM Provider
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {PROVIDERS.map((p) => {
            const isSelected = provider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderSelect(p.id)}
                className={`p-3.5 border-2 border-[#1a1a1a] text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#BFF000] text-[#1a1a1a] shadow-neo-sm translate-x-0.5"
                    : "bg-white text-[#1a1a1a] hover:bg-[#FDF9F0]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-syne font-black text-sm uppercase">{p.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 border border-[#1a1a1a] bg-white">
                      {p.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 leading-tight">{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSaveModel} className="flex flex-col gap-5 max-w-3xl">
          {/* Provider Specific API Key Input */}
          <div className="border-t-2 border-[#1a1a1a] pt-5">
            <h3 className="font-syne text-sm md:text-base font-black uppercase text-[#1a1a1a] mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#2D31FA]" />
              Step 2: API Credentials
            </h3>

            {provider === "groq" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    Groq API Key (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("groq", groqKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Verify Key & Fetch Live Models
                  </button>
                </div>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_... (Leave blank to use platform Groq key)"
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Leave blank to use Aptus platform built-in Groq key, or enter your personal Groq key for unlimited speed.
                </span>
              </div>
            )}

            {provider === "openai" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    OpenAI API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("openai", openaiKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Verify Key & Fetch Live Models
                  </button>
                </div>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Required for GPT-4o, GPT-4o Mini, and o1 reasoning models.
                </span>
              </div>
            )}

            {provider === "anthropic" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
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
                  placeholder="sk-ant-api03-..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
              </div>
            )}

            {provider === "xai" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    xAI Grok API Key
                  </label>
                </div>
                <input
                  type="password"
                  value={xaiKey}
                  onChange={(e) => setXaiKey(e.target.value)}
                  placeholder="xai-..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
              </div>
            )}

            {provider === "openrouter" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    OpenRouter API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("openrouter", openrouterKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Fetch OpenRouter Models
                  </button>
                </div>
                <input
                  type="password"
                  value={openrouterKey}
                  onChange={(e) => setOpenrouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
              </div>
            )}

            {provider === "custom" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                    Custom Base URL (OpenAI-Compatible)
                  </label>
                  <input
                    type="url"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://api.together.xyz/v1 or http://localhost:11434/v1"
                    className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                    API Key / Bearer Token
                  </label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="Bearer token (or dummy-key if local Ollama/vLLM)"
                    className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Model Selection */}
          <div className="border-t-2 border-[#1a1a1a] pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-syne text-sm md:text-base font-black uppercase text-[#1a1a1a] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF4D00]" />
                Step 3: Select AI Model {loadingModels ? "(Loading...)" : ""}
              </h3>
              <button
                type="button"
                onClick={() => setIsManualModel(!isManualModel)}
                className="text-[11px] font-bold text-gray-700 hover:text-black underline"
              >
                {isManualModel ? "← Back to curated list" : "Enter custom model ID manually"}
              </button>
            </div>

            {isManualModel ? (
              <div>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. llama-3.3-70b-versatile, gpt-4o, claude-3-5-sonnet-20241022"
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono font-bold outline-none"
                  required
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Type any custom fine-tuned or newly released model ID supported by {provider}.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentModels.map((m) => {
                    const isSelected = modelName === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setModelName(m.id)}
                        className={`p-3 border-2 border-[#1a1a1a] cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#2D31FA] text-white shadow-neo-sm translate-x-0.5"
                            : "bg-[#FDF9F0] hover:bg-white text-[#1a1a1a]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-syne font-black text-xs uppercase truncate">
                            {m.name || m.id}
                          </span>
                          {m.badge && (
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 border ${
                                isSelected ? "border-white bg-white/20 text-white" : "border-[#1a1a1a] bg-[#BFF000] text-[#1a1a1a]"
                              }`}
                            >
                              {m.badge}
                            </span>
                          )}
                        </div>
                        {m.desc && (
                          <div className={`text-[10px] mt-1.5 ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                            {m.desc}
                          </div>
                        )}
                        <div className={`text-[10px] font-mono mt-1 ${isSelected ? "text-white/60" : "text-gray-400"}`}>
                          ID: {m.id}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-[#FF4D00] hover:bg-[#E04400] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Saving Configuration...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Save AI Model Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}