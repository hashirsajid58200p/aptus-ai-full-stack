"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const PROVIDERS = [
  { id: "groq", name: "Groq", field: "groqApiKey", placeholder: "gsk_..." },
  { id: "gemini", name: "Google Gemini", field: "geminiApiKey", placeholder: "AIzaSy..." },
  { id: "deepseek", name: "DeepSeek", field: "deepseekApiKey", placeholder: "sk-..." },
  { id: "openai", name: "OpenAI", field: "openaiApiKey", placeholder: "sk-proj-..." },
  { id: "anthropic", name: "Anthropic", field: "anthropicApiKey", placeholder: "sk-ant-..." },
  { id: "mistral", name: "Mistral", field: "mistralApiKey", placeholder: "API key..." },
  { id: "perplexity", name: "Perplexity", field: "perplexityApiKey", placeholder: "pplx-..." },
  { id: "cohere", name: "Cohere", field: "cohereApiKey", placeholder: "API key..." },
  { id: "xai", name: "xAI Grok", field: "xaiApiKey", placeholder: "xai-..." },
  { id: "openrouter", name: "OpenRouter", field: "openrouterApiKey", placeholder: "sk-or-..." },
  { id: "custom", name: "Custom API", field: "customApiKey", placeholder: "Bearer token..." },
];

export default function AnalyticsUsage({ user, onUserUpdate }) {
  const [provider, setProvider] = useState(user?.provider || "groq");
  const [modelName, setModelName] = useState(user?.modelName || "");
  const [selectedTab, setSelectedTab] = useState(user?.provider || "groq");

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

  const [allModels, setAllModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setKeys({
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
      if (user?.customBaseUrl !== undefined) setCustomBaseUrl(user.customBaseUrl || "");
      if (user?.provider) setProvider(user.provider);
      if (user?.modelName) setModelName(user.modelName);
    }
  }, [user]);

  const fetchAllConnectedModels = async () => {
    setLoadingModels(true);
    try {
      const res = await fetch(`${baseurl}/user/models?provider=all`, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setAllModels(Array.isArray(data.models) ? data.models : []);
      }
    } catch (err) {
      console.warn("Could not fetch models:", err.message);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchAllConnectedModels();
  }, []);

  const currentProviderMeta = PROVIDERS.find((p) => p.id === selectedTab) || PROVIDERS[0];
  const currentKey = keys[selectedTab] || "";
  const isKeySavedInDb = Boolean(
    selectedTab === "custom" ? user?.customBaseUrl : user?.[currentProviderMeta.field]
  );

  // Save API Key for selected provider
  const handleSaveKey = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        [currentProviderMeta.field]: currentKey.trim(),
      };
      if (selectedTab === "custom") {
        payload.customBaseUrl = customBaseUrl.trim();
      }

      const res = await fetch(`${baseurl}/chatbot/model-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${currentProviderMeta.name} API key saved`);
        await fetchAllConnectedModels();
        if (onUserUpdate) onUserUpdate();
      } else {
        toast.error(data.message || "Failed to save key");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  // Immediately delete API Key from database & remove its models
  const handleDeleteKey = async () => {
    setDeleting(true);
    try {
      const payload = {
        [currentProviderMeta.field]: "",
      };
      if (selectedTab === "custom") {
        payload.customBaseUrl = "";
      }

      const res = await fetch(`${baseurl}/chatbot/model-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setKeys((prev) => ({ ...prev, [selectedTab]: "" }));
        if (selectedTab === "custom") setCustomBaseUrl("");
        setAllModels((prev) => prev.filter((m) => m.provider !== selectedTab));
        toast.success(`${currentProviderMeta.name} API key removed`);
        if (onUserUpdate) onUserUpdate();
        await fetchAllConnectedModels();
      } else {
        toast.error(data.message || "Failed to remove key");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setDeleting(false);
    }
  };

  // Switch active model immediately
  const handleSelectModel = async (model) => {
    const targetProvider = model.provider || selectedTab;
    const targetModelId = model.id;
    setProvider(targetProvider);
    setModelName(targetModelId);

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
        toast.success(`Selected ${model.name || targetModelId}`);
        if (onUserUpdate) onUserUpdate();
      } else {
        toast.error(data.message || "Failed to select model");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    }
  };

  const providerModels = useMemo(() => {
    return allModels.filter((m) => m.provider === selectedTab);
  }, [allModels, selectedTab]);

  return (
    <div className="bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 sm:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="border-b-2 border-[#1a1a1a] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 py-0.5 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-[#1a1a1a]">
            ACTIVE PROVIDER: {provider.toUpperCase()}
          </span>
          <span className="text-xs font-bold text-gray-600 truncate">
            Model: <strong className="text-[#1a1a1a]">{modelName || "Default"}</strong>
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-gray-500">
          Configure API credentials & choose AI intelligence engine
        </div>
      </div>

      {/* Providers */}
      <div>
        <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-2">
          Provider
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {PROVIDERS.map((p) => {
            const isSelected = selectedTab === p.id;
            const hasKey = Boolean(p.id === "custom" ? user?.customBaseUrl : user?.[p.field]);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedTab(p.id)}
                className={`px-3 py-2.5 border-2 border-[#1a1a1a] font-bold text-xs uppercase text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#BFF000] text-[#1a1a1a] shadow-neo-sm"
                    : "bg-[#FDF9F0] text-[#1a1a1a] hover:bg-white"
                }`}
              >
                <span className="truncate">{p.name}</span>
                {hasKey && (
                  <span className="w-2 h-2 bg-emerald-500 border border-[#1a1a1a] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* API Key Form */}
      <form onSubmit={handleSaveKey} className="space-y-4">
        {selectedTab === "custom" && (
          <div>
            <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
              Base URL
            </label>
            <input
              type="url"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
              placeholder="https://api.together.xyz/v1"
              className="w-full bg-[#FDF9F0] border-2 border-[#1a1a1a] font-mono text-xs sm:text-sm py-2.5 px-3 text-[#1a1a1a] focus:outline-none"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
            {currentProviderMeta.name} API Key
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type={currentKey.includes("••••") ? "text" : "password"}
              value={currentKey}
              onFocus={() => {
                if (currentKey.includes("••••")) {
                  setKeys((prev) => ({ ...prev, [selectedTab]: "" }));
                }
              }}
              onChange={(e) =>
                setKeys((prev) => ({ ...prev, [selectedTab]: e.target.value }))
              }
              placeholder={currentProviderMeta.placeholder}
              className="flex-1 bg-[#FDF9F0] border-2 border-[#1a1a1a] font-mono text-xs sm:text-sm py-2.5 px-3 text-[#1a1a1a] focus:outline-none"
            />

            <button
              type="submit"
              disabled={saving || !currentKey.trim() || currentKey.includes("••••")}
              className="btn-neo-primary px-5 py-2.5 text-xs font-extrabold uppercase disabled:opacity-50 cursor-pointer shrink-0"
            >
              {saving ? "SAVING..." : "SAVE KEY"}
            </button>

            {(isKeySavedInDb || currentKey) && (
              <button
                type="button"
                onClick={handleDeleteKey}
                disabled={deleting}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                title="Delete API Key"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "REMOVING..." : "REMOVE"}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Models List for Selected Provider */}
      <div className="border-t-2 border-[#1a1a1a] pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-black uppercase text-[#1a1a1a]">
            Models ({providerModels.length})
          </label>
          {loadingModels && (
            <RefreshCw className="w-3.5 h-3.5 text-[#1a1a1a] animate-spin" />
          )}
        </div>

        {providerModels.length === 0 ? (
          <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] text-xs font-bold text-gray-600">
            {loadingModels
              ? "Loading models..."
              : `Save your ${currentProviderMeta.name} API key above to load models.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {providerModels.map((m) => {
              const isSelected = provider === m.provider && modelName === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectModel(m)}
                  className={`p-3 border-2 border-[#1a1a1a] text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2D31FA] text-white shadow-neo-sm"
                      : "bg-[#FDF9F0] hover:bg-white text-[#1a1a1a]"
                  }`}
                >
                  <div className="font-bold text-xs truncate">{m.name || m.id}</div>
                  <div
                    className={`font-mono text-[10px] truncate mt-0.5 ${
                      isSelected ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {m.id}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
