"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Cpu, Key, RefreshCw, CheckCircle2, Sparkles, AlertCircle, Search, Check } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const PROVIDERS = [
  { id: "groq", name: "Groq", placeholder: "gsk_...", hint: "Ultra-fast inference (GPT-OSS, Qwen, Allam)" },
  { id: "gemini", name: "Google Gemini", placeholder: "AIzaSy... (from aistudio.google.com)", hint: "Free tier available — Gemini Flash & Pro chat models" },
  { id: "deepseek", name: "DeepSeek", placeholder: "sk-...", hint: "DeepSeek V3 & R1 reasoning chat models" },
  { id: "openai", name: "OpenAI", placeholder: "sk-proj-...", hint: "GPT-4o, GPT-4.1, and o1/o3 chat models" },
  { id: "anthropic", name: "Anthropic Claude", placeholder: "sk-ant-api03-...", hint: "Claude Sonnet, Haiku, and Opus chat models" },
  { id: "mistral", name: "Mistral AI", placeholder: "Mistral API key...", hint: "Mistral Large, Small, and Codestral" },
  { id: "perplexity", name: "Perplexity", placeholder: "pplx-...", hint: "Sonar real-time online search chat models" },
  { id: "cohere", name: "Cohere", placeholder: "Cohere API key...", hint: "Command R+ and Command A enterprise chat models" },
  { id: "xai", name: "xAI Grok", placeholder: "xai-...", hint: "Grok chat & reasoning models" },
  { id: "openrouter", name: "OpenRouter", placeholder: "sk-or-v1-...", hint: "Unified gateway to hundreds of text chat models" },
  { id: "custom", name: "Custom API", placeholder: "Bearer token (or dummy-key)", hint: "OpenAI-compatible endpoint (Ollama, vLLM, Together)" },
];

const formatContext = (ctx) => {
  if (!ctx) return null;
  if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(ctx % 1000000 === 0 ? 0 : 1)}M ctx`;
  if (ctx >= 1000) return `${Math.round(ctx / 1024)}K ctx`;
  return `${ctx} ctx`;
};

export default function AnalyticsUsage({ user, onUserUpdate }) {
  const [provider, setProvider] = useState(user?.provider || "groq");
  const [modelName, setModelName] = useState(user?.modelName || "openai/gpt-oss-120b");

  // One-Time API Keys Vault state
  const [keys, setKeys] = useState({
    groq: user?.groqApiKey || "",
    gemini: user?.geminiApiKey || "",
    deepseek: user?.deepseekApiKey || "",
    mistral: user?.mistralApiKey || "",
    cohere: user?.cohereApiKey || "",
    perplexity: user?.perplexityApiKey || "",
    openai: user?.openaiApiKey || "",
    anthropic: user?.anthropicApiKey || "",
    xai: user?.xaiApiKey || "",
    openrouter: user?.openrouterApiKey || "",
    custom: user?.customApiKey || "",
  });
  const [customBaseUrl, setCustomBaseUrl] = useState(user?.customBaseUrl || "");
  const [activeKeyTab, setActiveKeyTab] = useState(user?.provider || "gemini");

  // Unified Chat Models state
  const [allModels, setAllModels] = useState([]);
  const [connectedProviders, setConnectedProviders] = useState([]);
  const [filterProvider, setFilterProvider] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingModels, setLoadingModels] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [switchingModelId, setSwitchingModelId] = useState(null);
  const [isManualModel, setIsManualModel] = useState(false);

  const handleKeyChange = (provId, value) => {
    setKeys((prev) => ({ ...prev, [provId]: value }));
  };

  // Fetch all pure chat models across all connected providers in one call
  const fetchAllConnectedModels = async () => {
    setLoadingModels(true);
    try {
      const res = await fetch(`${baseurl}/user/models?provider=all`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAllModels(Array.isArray(data.models) ? data.models : []);
        setConnectedProviders(Array.isArray(data.connectedProviders) ? data.connectedProviders : []);
      }
    } catch (err) {
      console.warn("Could not fetch unified models:", err.message);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchAllConnectedModels();
  }, []);

  // 1-Click instant model switch
  const handleSelectModel = async (model) => {
    const targetProvider = model.provider || provider;
    const targetModelId = model.id;
    setProvider(targetProvider);
    setModelName(targetModelId);
    setSwitchingModelId(`${targetProvider}:${targetModelId}`);

    try {
      const res = await fetch(`${baseurl}/chatbot/model-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          provider: targetProvider,
          modelName: targetModelId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Active model switched to ${model.name || targetModelId}`);
        if (onUserUpdate) onUserUpdate();
      } else {
        toast.error(data.message || "Failed to switch model");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setSwitchingModelId(null);
    }
  };

  // Save API Keys in Vault once & sync all models
  const handleSaveVaultKeys = async (e) => {
    if (e) e.preventDefault();
    setSavingKeys(true);
    try {
      const res = await fetch(`${baseurl}/chatbot/model-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          provider,
          modelName,
          groqApiKey: keys.groq,
          geminiApiKey: keys.gemini,
          deepseekApiKey: keys.deepseek,
          mistralApiKey: keys.mistral,
          cohereApiKey: keys.cohere,
          perplexityApiKey: keys.perplexity,
          openaiApiKey: keys.openai,
          anthropicApiKey: keys.anthropic,
          xaiApiKey: keys.xai,
          openrouterApiKey: keys.openrouter,
          customApiKey: keys.custom,
          customBaseUrl: customBaseUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("API keys saved! Syncing live chat models...");
        await fetchAllConnectedModels();
        if (onUserUpdate) onUserUpdate();
      } else {
        toast.error(data.message || "Failed to save API keys");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setSavingKeys(false);
    }
  };

  const filteredModels = useMemo(() => {
    return allModels.filter((m) => {
      if (filterProvider !== "all" && m.provider !== filterProvider) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.id.toLowerCase().includes(q) ||
          (m.name && m.name.toLowerCase().includes(q)) ||
          (m.provider && m.provider.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allModels, filterProvider, searchQuery]);

  const activeProviderMeta = PROVIDERS.find((p) => p.id === activeKeyTab) || PROVIDERS[0];

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 md:p-6">
      {/* Header */}
      <div className="border-b-3 border-[#1a1a1a] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-syne text-xl md:text-2xl font-black uppercase tracking-tight text-[#1a1a1a]">
            AI Models & API Keys Vault
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Save your provider keys once in the vault below, then switch verified Chat LLMs in 1 click.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-black uppercase text-gray-500">Active:</span>
          <span className="px-2.5 py-1 bg-[#2D31FA] text-white border-2 border-[#1a1a1a] font-mono font-bold text-xs">
            {provider.toUpperCase()} / {modelName}
          </span>
        </div>
      </div>

      {/* SECTION 1: 1-CLICK UNIFIED CHAT MODEL SELECTOR */}
      <div className="border-2 border-[#1a1a1a] p-4 md:p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-syne text-sm md:text-base font-black uppercase text-[#1a1a1a] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF4D00]" />
            1-Click Chat Model Switcher
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#BFF000] border border-[#1a1a1a]">
              {allModels.length} Chat LLMs Ready
            </span>
          </h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAllConnectedModels}
              className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingModels ? "animate-spin" : ""}`} />
              Sync Models
            </button>
            <button
              type="button"
              onClick={() => setIsManualModel(!isManualModel)}
              className="text-xs font-bold text-gray-700 hover:text-black underline cursor-pointer"
            >
              {isManualModel ? "← Back to live models" : "Custom Model ID"}
            </button>
          </div>
        </div>

        {isManualModel ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-bold uppercase outline-none"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter exact model ID (e.g. gemini-3.8-flash)"
              className="flex-1 p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs md:text-sm font-mono font-bold outline-none"
            />
            <button
              type="button"
              onClick={() => handleSelectModel({ id: modelName, name: modelName, provider })}
              className="px-5 py-2.5 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] font-black text-xs uppercase cursor-pointer"
            >
              Apply Model
            </button>
          </div>
        ) : (
          <>
            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFilterProvider("all")}
                  className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-[#1a1a1a] cursor-pointer transition-all ${
                    filterProvider === "all"
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-[#FDF9F0] text-[#1a1a1a] hover:bg-gray-100"
                  }`}
                >
                  All ({allModels.length})
                </button>
                {connectedProviders.map((provId) => {
                  const count = allModels.filter((m) => m.provider === provId).length;
                  const pName = PROVIDERS.find((p) => p.id === provId)?.name || provId;
                  return (
                    <button
                      key={provId}
                      type="button"
                      onClick={() => setFilterProvider(provId)}
                      className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-[#1a1a1a] cursor-pointer transition-all ${
                        filterProvider === provId
                          ? "bg-[#BFF000] text-[#1a1a1a]"
                          : "bg-[#FDF9F0] text-[#1a1a1a] hover:bg-gray-100"
                      }`}
                    >
                      {pName} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chat models..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-mono outline-none"
                />
              </div>
            </div>

            {loadingModels ? (
              <div className="p-8 border-2 border-dashed border-[#1a1a1a] bg-[#FDF9F0] text-center flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#2D31FA] animate-spin" />
                <p className="text-xs font-bold text-gray-700">
                  Syncing verified conversational Chat LLMs across your connected providers...
                </p>
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-[#1a1a1a] bg-[#FDF9F0] text-center flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <p className="text-xs font-bold text-gray-700">
                  No chat models matched. Add an API key in the Vault below and click &quot;Save Keys &amp; Sync Models&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {filteredModels.map((m) => {
                  const isSelected = provider === m.provider && modelName === m.id;
                  const isSwitching = switchingModelId === `${m.provider}:${m.id}`;
                  const ctxLabel = formatContext(m.contextWindow);

                  return (
                    <button
                      key={`${m.provider}:${m.id}`}
                      type="button"
                      onClick={() => handleSelectModel(m)}
                      disabled={isSwitching}
                      className={`p-3 border-2 border-[#1a1a1a] text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#2D31FA] text-white shadow-neo-sm"
                          : "bg-[#FDF9F0] hover:bg-[#BFF000]/30 text-[#1a1a1a]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <span className="font-syne font-black text-xs leading-tight truncate">
                          {m.name || m.id}
                        </span>
                        {isSelected ? (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 border border-white bg-white/20 text-white shrink-0 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 border border-[#1a1a1a] bg-white text-[#1a1a1a] shrink-0">
                            {m.provider}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2 w-full">
                        <span
                          className={`font-mono text-[10px] truncate ${
                            isSelected ? "text-white/80" : "text-gray-600"
                          }`}
                        >
                          {m.id}
                        </span>
                        {ctxLabel && (
                          <span
                            className={`text-[9px] font-mono font-bold shrink-0 ${
                              isSelected ? "text-white/90" : "text-gray-500"
                            }`}
                          >
                            {ctxLabel}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* SECTION 2: ONE-TIME API KEYS VAULT */}
      <form onSubmit={handleSaveVaultKeys} className="border-2 border-[#1a1a1a] p-4 md:p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-syne text-sm md:text-base font-black uppercase text-[#1a1a1a] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#2D31FA]" />
              API Keys Vault (One-Time Setup)
            </h3>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Configure your provider keys once. All connected providers automatically populate the model switcher above.
            </p>
          </div>

          <button
            type="submit"
            disabled={savingKeys}
            className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#E04400] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {savingKeys ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving & Syncing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Save Keys & Sync Models
              </>
            )}
          </button>
        </div>

        {/* Provider Selector Pills for Vault */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {PROVIDERS.map((p) => {
            const hasKey = p.id === "custom" ? !!customBaseUrl : !!keys[p.id];
            const isTabActive = activeKeyTab === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveKeyTab(p.id)}
                className={`p-2.5 border-2 border-[#1a1a1a] text-left transition-all flex items-center justify-between cursor-pointer ${
                  isTabActive
                    ? "bg-[#BFF000] text-[#1a1a1a] shadow-neo-sm"
                    : "bg-[#FDF9F0] text-[#1a1a1a] hover:bg-white"
                }`}
              >
                <span className="font-syne font-black text-xs uppercase truncate">{p.name}</span>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 border border-[#1a1a1a] shrink-0 ${
                    hasKey ? "bg-emerald-400 text-black" : "bg-white text-gray-500"
                  }`}
                >
                  {hasKey ? "KEY SET" : "EMPTY"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Provider Key Input Box */}
        <div className="p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
          {activeKeyTab === "custom" ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                  Custom Base URL (OpenAI-Compatible)
                </label>
                <input
                  type="url"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://api.together.xyz/v1 or http://localhost:11434/v1"
                  className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-xs font-mono outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                  API Key / Bearer Token
                </label>
                <input
                  type="password"
                  value={keys.custom}
                  onChange={(e) => handleKeyChange("custom", e.target.value)}
                  placeholder={activeProviderMeta.placeholder}
                  className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-xs font-mono outline-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase text-[#1a1a1a]">
                  {activeProviderMeta.name} API Key
                </label>
                {keys[activeKeyTab] && (
                  <button
                    type="button"
                    onClick={() => handleKeyChange(activeKeyTab, "")}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Clear Key
                  </button>
                )}
              </div>
              <input
                type="password"
                value={keys[activeKeyTab] || ""}
                onChange={(e) => handleKeyChange(activeKeyTab, e.target.value)}
                placeholder={activeProviderMeta.placeholder}
                className="w-full p-2.5 bg-white border-2 border-[#1a1a1a] text-xs md:text-sm font-mono outline-none"
              />
              <span className="text-[11px] text-gray-600 mt-1 block">
                {activeProviderMeta.hint}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
