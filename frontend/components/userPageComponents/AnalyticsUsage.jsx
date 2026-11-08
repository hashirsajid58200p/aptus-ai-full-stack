"use client";
import React, { useState, useEffect } from "react";
import { Cpu, Key, CheckCircle, BarChart3, RefreshCw, AlertCircle } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

export default function AnalyticsUsage({ user, onUserUpdate }) {
  const [provider, setProvider] = useState(user?.provider || "groq");
  const [modelName, setModelName] = useState(user?.modelName || "llama-3.3-70b-versatile");
  const [openaiKey, setOpenaiKey] = useState(user?.openaiApiKey || "");
  const [groqKey, setGroqKey] = useState(user?.groqApiKey || "");
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalUsed = user?.tokenUsage?.totalTokens || 0;
  const tokenLimit = user?.tokenLimit || 500000;
  const percentage = Math.min(100, Math.round((totalUsed / tokenLimit) * 100));
  const dailyStats = user?.tokenUsage?.dailyUsage || [];

  // Fetch available models for provider and API key
  const fetchModels = async (prov = provider, customKey = null) => {
    setLoadingModels(true);
    try {
      const activeKey = customKey !== null ? customKey : (prov === "openai" ? openaiKey : groqKey);
      const url = new URL(`${baseurl}/user/models`);
      url.searchParams.set("provider", prov);
      if (activeKey) {
        url.searchParams.set("apiKey", activeKey);
      }

      const res = await fetch(url.toString(), {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.models)) {
        setAvailableModels(data.models);
        // If current modelName isn't in fetched list, set to first one
        if (!data.models.some((m) => m.id === modelName)) {
          if (data.models[0]) setModelName(data.models[0].id);
        }
      } else {
        toast.error(data.message || "Could not fetch models for this key");
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
          openaiApiKey: openaiKey || undefined,
          groqApiKey: groqKey || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("AI Model configuration updated!");
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
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6">
      {/* Header */}
      <div className="border-b-3 border-[#1a1a1a] pb-4">
        <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
          USAGE & MULTI-MODEL
        </span>
        <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block">
          Token Analytics & Model Settings
        </h2>
      </div>

      {/* Quota Gauge */}
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
          <span className="text-[11px] font-bold text-gray-500">{percentage}% of monthly limit used</span>
        </div>

        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase text-gray-600">Monthly Limit</span>
          <span className="font-syne text-2xl font-black text-[#1a1a1a]">{tokenLimit.toLocaleString()}</span>
          <span className="text-xs text-gray-500 font-medium">Assigned by Agency Administrator</span>
        </div>

        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase text-gray-600">Active AI Engine</span>
          <span className="font-syne text-xl font-black text-[#FF4D00] uppercase">
            {provider === "openai" ? "OpenAI" : "Groq"}
          </span>
          <span className="text-xs text-gray-700 font-bold truncate">Model: {modelName}</span>
        </div>
      </div>

      {/* Multi-Model Configuration Form */}
      <div className="border-2 border-[#1a1a1a] p-5 bg-white">
        <h3 className="font-syne text-lg font-black uppercase text-[#1a1a1a] mb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#FF4D00]" />
          Configure AI Intelligence Engine
        </h3>
        <p className="text-xs text-gray-600 font-medium mb-4">
          Switch between Groq (Llama 3 / open-source models) and OpenAI (GPT-4o / GPT-4o-mini). Put your API key, and available models will list automatically below.
        </p>

        <form onSubmit={handleSaveModel} className="flex flex-col gap-5 max-w-xl">
          <div>
            <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">
              Select Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setProvider("groq");
                  fetchModels("groq");
                }}
                className={`p-3 border-2 border-[#1a1a1a] text-xs font-extrabold uppercase text-left transition-all ${
                  provider === "groq" ? "bg-[#BFF000] shadow-neo-sm" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-black text-sm">Groq (Ultra-Fast)</div>
                <div className="text-[10px] text-gray-600 font-normal">Llama 3, Mixtral, Whisper STT</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProvider("openai");
                  fetchModels("openai");
                }}
                className={`p-3 border-2 border-[#1a1a1a] text-xs font-extrabold uppercase text-left transition-all ${
                  provider === "openai" ? "bg-[#FF4D00] text-white shadow-neo-sm" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-black text-sm">OpenAI (Paid)</div>
                <div className="text-[10px] opacity-90 font-normal">GPT-4o, GPT-4o Mini, O1</div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {provider === "openai" ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                  Your OpenAI API Key
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
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-sm font-mono outline-none"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Entering your API key dynamically fetches your accessible models below.
              </span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase text-[#1a1a1a]">
                  Your Custom Groq API Key (Optional)
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
                placeholder="gsk_... (Leave empty to use shared system key)"
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-sm font-mono outline-none"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Leave empty to use platform default Groq key, or enter your personal Groq key.
              </span>
            </div>
          )}

          {/* Dynamic Model Dropdown */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-[#1a1a1a] mb-1">
              Select AI Model {loadingModels && "(Fetching accessible models...)"}
            </label>
            {availableModels.length > 0 ? (
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-sm font-bold outline-none cursor-pointer"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.id}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter model name (e.g. llama-3.3-70b-versatile)"
                className="w-full p-2.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-sm font-mono font-bold outline-none"
              />
            )}
            <span className="text-[11px] text-gray-500 mt-1 block">
              The selected model will answer all conversations for your chatbot.
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="self-start px-5 py-2.5 bg-[#1a1a1a] text-white font-extrabold text-xs uppercase border-2 border-[#1a1a1a] shadow-neo hover:bg-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save AI Model Settings"}
          </button>
        </form>
      </div>

      {/* Daily Consumption History */}
      <div className="border-2 border-[#1a1a1a] p-4">
        <h4 className="font-syne text-sm font-extrabold uppercase text-[#1a1a1a] mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#BFF000]" />
          Recent Daily Token Usage
        </h4>
        {dailyStats.length === 0 ? (
          <p className="text-xs text-gray-500">No token activity recorded in the current billing cycle yet.</p>
        ) : (
          <div className="space-y-2">
            {dailyStats.slice(-7).reverse().map((day, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2 bg-[#FDF9F0] border border-[#1a1a1a]">
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
