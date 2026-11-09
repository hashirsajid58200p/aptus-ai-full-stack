"use client";
import React, { useState, useEffect } from "react";
import { Cpu, Key, RefreshCw, CheckCircle2, ShieldCheck, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const PROVIDERS = [
  { id: "groq", name: "Groq", desc: "Ultra-fast open models (GPT-OSS, Qwen, Allam)" },
  { id: "gemini", name: "Google Gemini", desc: "Gemini 2.0 Flash, 1.5 Pro & Flash (Free tier available)" },
  { id: "deepseek", name: "DeepSeek", desc: "DeepSeek V3 & R1 Reasoning models" },
  { id: "openai", name: "OpenAI", desc: "GPT-4o, GPT-4o Mini, and o1/o3 reasoning" },
  { id: "anthropic", name: "Anthropic Claude", desc: "Claude 3.5 Sonnet and Haiku" },
  { id: "mistral", name: "Mistral AI", desc: "Mistral Large, Small, and Codestral" },
  { id: "perplexity", name: "Perplexity", desc: "Sonar search & reasoning models" },
  { id: "cohere", name: "Cohere", desc: "Command R+ and Command R enterprise models" },
  { id: "xai", name: "xAI Grok", desc: "Grok 2 and Grok Beta models" },
  { id: "openrouter", name: "OpenRouter", desc: "Unified multi-provider AI gateway" },
  { id: "custom", name: "Custom API", desc: "Self-hosted vLLM, Ollama, or OpenAI proxy" },
];

export default function AnalyticsUsage({ user, onUserUpdate }) {
  const [provider, setProvider] = useState(user?.provider || "groq");
  const [modelName, setModelName] = useState(user?.modelName || "openai/gpt-oss-120b");
  const [groqKey, setGroqKey] = useState(user?.groqApiKey || "");
  const [geminiKey, setGeminiKey] = useState(user?.geminiApiKey || "");
  const [deepseekKey, setDeepseekKey] = useState(user?.deepseekApiKey || "");
  const [mistralKey, setMistralKey] = useState(user?.mistralApiKey || "");
  const [cohereKey, setCohereKey] = useState(user?.cohereApiKey || "");
  const [perplexityKey, setPerplexityKey] = useState(user?.perplexityApiKey || "");
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
      case "gemini": return geminiKey;
      case "deepseek": return deepseekKey;
      case "mistral": return mistralKey;
      case "cohere": return cohereKey;
      case "perplexity": return perplexityKey;
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
    const activeKey = keyOverride !== null ? keyOverride : getKeyForProvider(prov);
    const activeUrl = urlOverride !== null ? urlOverride : customBaseUrl;

    if (!activeKey && prov !== "custom") {
      setAvailableModels([]);
      return;
    }
    if (prov === "custom" && !activeUrl) {
      setAvailableModels([]);
      return;
    }

    setLoadingModels(true);
    try {
      const params = new URLSearchParams();
      params.set("provider", prov);
      if (activeKey) params.set("apiKey", activeKey);
      if (prov === "custom" && activeUrl) params.set("customBaseUrl", activeUrl);

      const res = await fetch(`${baseurl}/user/models?${params.toString()}`, { credentials: "include" });
      const data = await res.json();

      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        setAvailableModels(data.models);
        if (!data.models.some((m) => m.id === modelName)) {
          setModelName(data.models[0].id);
        }
      } else {
        setAvailableModels([]);
        if (data.message) toast.error(data.message);
      }
    } catch (err) {
      console.warn("Could not fetch models:", err.message);
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    const key = getKeyForProvider(provider);
    if (key || (provider === "custom" && customBaseUrl)) {
      fetchModels(provider, key);
    } else {
      setAvailableModels([]);
    }
  }, [provider]);

  const handleProviderSelect = (newProv) => {
    setProvider(newProv);
    setAvailableModels([]);
    const key = getKeyForProvider(newProv);
    if (key || (newProv === "custom" && customBaseUrl)) {
      fetchModels(newProv, key);
    }
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
          geminiApiKey: geminiKey || undefined,
          deepseekApiKey: deepseekKey || undefined,
          mistralApiKey: mistralKey || undefined,
          cohereApiKey: cohereKey || undefined,
          perplexityApiKey: perplexityKey || undefined,
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
        toast.success("Settings saved! Fetching available models...");
        await fetchModels(provider);
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
                    {isSelected && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 border border-[#1a1a1a] bg-black text-white">
                        ACTIVE
                      </span>
                    )}
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

            {provider === "gemini" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    Google Gemini API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("gemini", geminiKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Verify Key & Fetch Live Models
                  </button>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy... (Get free key from aistudio.google.com)"
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Generous free tier! Supports Gemini 2.0 Flash, Gemini 1.5 Flash, and Gemini 1.5 Pro.
                </span>
              </div>
            )}

            {provider === "deepseek" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    DeepSeek API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("deepseek", deepseekKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Verify Key & Fetch Models
                  </button>
                </div>
                <input
                  type="password"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Supports DeepSeek-V3 (deepseek-chat) and DeepSeek-R1 (deepseek-reasoner).
                </span>
              </div>
            )}

            {provider === "mistral" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    Mistral AI API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("mistral", mistralKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Verify Key & Fetch Models
                  </button>
                </div>
                <input
                  type="password"
                  value={mistralKey}
                  onChange={(e) => setMistralKey(e.target.value)}
                  placeholder="api key..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Supports Mistral Large, Mistral Small, and Codestral.
                </span>
              </div>
            )}

            {provider === "perplexity" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    Perplexity API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("perplexity", perplexityKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Fetch Models
                  </button>
                </div>
                <input
                  type="password"
                  value={perplexityKey}
                  onChange={(e) => setPerplexityKey(e.target.value)}
                  placeholder="pplx-..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Online real-time search models: Sonar, Sonar Pro, and Sonar Reasoning.
                </span>
              </div>
            )}

            {provider === "cohere" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                    Cohere API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchModels("cohere", cohereKey)}
                    className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingModels ? "animate-spin" : ""}`} />
                    Fetch Models
                  </button>
                </div>
                <input
                  type="password"
                  value={cohereKey}
                  onChange={(e) => setCohereKey(e.target.value)}
                  placeholder="cohere api key..."
                  className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Enterprise models: Command R+ and Command R.
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
                  Enter any custom model ID supported by {provider}.
                </span>
              </div>
            ) : availableModels.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-[#1a1a1a] bg-[#FDF9F0] text-center flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <p className="text-xs font-bold text-gray-700">
                  {loadingModels
                    ? `Fetching available models from ${PROVIDERS.find((p) => p.id === provider)?.name} API...`
                    : `No models loaded. Please enter your ${PROVIDERS.find((p) => p.id === provider)?.name} API key above and click "Save & Fetch Live Models" below.`}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {availableModels.map((m) => {
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
                          <span className="font-mono font-bold text-xs truncate">
                            {m.id}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 border border-white bg-white/20 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        {m.name && m.name !== m.id && (
                          <div className={`text-[11px] mt-1 truncate ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                            {m.name}
                          </div>
                        )}
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
            className="w-full sm:w-auto px-6 py-3 bg-[#FF4D00] hover:bg-[#E04400] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Saving & Fetching Models...
              </>
            ) : availableModels.length === 0 ? (
              <>
                <RefreshCw className="w-4 h-4" /> Save Key & Fetch Live Models
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