"use client";
import React from "react";
import {
  BarChart3,
  Cpu,
  Palette,
  Briefcase,
  MessageSquare,
  History,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function OverviewTab({ user, onNavigateTab }) {
  const totalUsed = user?.tokenUsage?.totalTokens || 0;
  const tokenLimit = user?.tokenLimit || 500000;
  const percentage = Math.min(100, Math.round((totalUsed / tokenLimit) * 100));

  const questionsCount = user?.bussinessDetails?.length || 0;
  const activeEngine = user?.provider ? user.provider.toUpperCase() : "GROQ";
  const activeModel = user?.modelName || "llama-3.3-70b-versatile";
  const activeTheme = user?.theme || "aptus";

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 md:p-6">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-3 border-[#1a1a1a] pb-4 gap-4">
        <div>
          <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
            EXECUTIVE DASHBOARD
          </span>
          <h2 className="font-syne text-xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block mt-2 md:mt-0">
            Overview & Analytics
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-xs font-black uppercase text-[#1a1a1a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
            Chatbot: Live & Active
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Usage Card */}
        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] shadow-neo-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black uppercase text-gray-600 mb-1">
              <span>Tokens Consumed</span>
              <Zap className="w-4 h-4 text-[#FF4D00]" />
            </div>
            <div className="font-syne text-2xl font-black text-[#1a1a1a]">
              {totalUsed.toLocaleString()}
            </div>
            <div className="w-full bg-gray-200 h-2.5 border border-[#1a1a1a] overflow-hidden my-2">
              <div
                className={`h-full ${percentage > 85 ? "bg-red-500" : "bg-[#BFF000]"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] font-bold text-gray-500 flex justify-between">
            <span>{percentage}% utilized</span>
            <span>Limit: {tokenLimit.toLocaleString()}</span>
          </div>
        </div>

        {/* Active AI Engine Card */}
        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] shadow-neo-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black uppercase text-gray-600 mb-1">
              <span>Connected AI Engine</span>
              <Cpu className="w-4 h-4 text-[#2D31FA]" />
            </div>
            <div className="font-syne text-xl font-black text-[#2D31FA] uppercase truncate">
              {activeEngine}
            </div>
            <div className="text-xs font-bold text-gray-700 truncate mt-1">
              {activeModel}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("ai model & keys")}
            className="mt-3 text-[11px] font-black uppercase text-[#2D31FA] hover:underline flex items-center gap-1 self-start"
          >
            Configure Engine <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Installed Theme Card */}
        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] shadow-neo-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black uppercase text-gray-600 mb-1">
              <span>NPM Widget Theme</span>
              <Palette className="w-4 h-4 text-[#FF4D00]" />
            </div>
            <div className="font-syne text-xl font-black text-[#1a1a1a] uppercase truncate">
              {activeTheme}
            </div>
            <div className="text-xs font-bold text-gray-500 mt-1">
              {user?.borderRadius ? `Radius: ${user.borderRadius}` : "Theme Default Border"}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("appearance & theme")}
            className="mt-3 text-[11px] font-black uppercase text-[#FF4D00] hover:underline flex items-center gap-1 self-start"
          >
            Customize Look <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Knowledge Base FAQs Card */}
        <div className="p-4 border-2 border-[#1a1a1a] bg-[#FDF9F0] shadow-neo-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-black uppercase text-gray-600 mb-1">
              <span>Knowledge Base</span>
              <HelpCircle className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className="font-syne text-2xl font-black text-[#1a1a1a]">
              {questionsCount} <span className="text-xs font-bold text-gray-500 uppercase">Trained FAQs</span>
            </div>
            <div className="text-xs font-bold text-gray-600 truncate mt-1">
              {user?.bussinessCategory || "General Business"}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("business details")}
            className="mt-3 text-[11px] font-black uppercase text-[#10b981] hover:underline flex items-center gap-1 self-start"
          >
            Edit Knowledge Base <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="border-2 border-[#1a1a1a] p-4 md:p-5 bg-[#FDF9F0]">
        <h3 className="font-syne text-sm font-black uppercase text-[#1a1a1a] mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FF4D00]" /> Quick Workflows
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab("test chatbot")}
            className="p-3 bg-white border-2 border-[#1a1a1a] shadow-neo-sm text-left hover:bg-[#BFF000] transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#1a1a1a] mb-1" />
            <div className="font-syne font-black text-xs uppercase">Test Chatbot Live</div>
            <div className="text-[10px] text-gray-600 mt-0.5">Sandbox with STT Voice</div>
          </button>
          <button
            onClick={() => onNavigateTab("appearance & theme")}
            className="p-3 bg-white border-2 border-[#1a1a1a] shadow-neo-sm text-left hover:bg-[#BFF000] transition-colors"
          >
            <Palette className="w-4 h-4 text-[#1a1a1a] mb-1" />
            <div className="font-syne font-black text-xs uppercase">Appearance & Themes</div>
            <div className="text-[10px] text-gray-600 mt-0.5">Avatars, colors, radius</div>
          </button>
          <button
            onClick={() => onNavigateTab("ai model & keys")}
            className="p-3 bg-white border-2 border-[#1a1a1a] shadow-neo-sm text-left hover:bg-[#BFF000] transition-colors"
          >
            <Cpu className="w-4 h-4 text-[#1a1a1a] mb-1" />
            <div className="font-syne font-black text-xs uppercase">AI Engine & Keys</div>
            <div className="text-[10px] text-gray-600 mt-0.5">Groq, OpenAI, Claude</div>
          </button>
          <button
            onClick={() => onNavigateTab("sessions")}
            className="p-3 bg-white border-2 border-[#1a1a1a] shadow-neo-sm text-left hover:bg-[#BFF000] transition-colors"
          >
            <History className="w-4 h-4 text-[#1a1a1a] mb-1" />
            <div className="font-syne font-black text-xs uppercase">Customer Sessions</div>
            <div className="text-[10px] text-gray-600 mt-0.5">View transcripts & logs</div>
          </button>
        </div>
      </div>

      {/* Business Profile & Details Summary (Placed right below Analytics) */}
      <div className="border-2 border-[#1a1a1a] p-4 md:p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#1a1a1a] pb-3 mb-4 gap-2">
          <div>
            <span className="text-[10px] font-black uppercase text-[#FF4D00] tracking-wider block">
              TRAINED KNOWLEDGE PROFILE
            </span>
            <h3 className="font-syne text-lg md:text-xl font-black uppercase text-[#1a1a1a]">
              Business Information & FAQ Knowledge Base
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab("business details")}
            className="px-3 py-1.5 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase hover:translate-x-0.5 transition-transform self-start sm:self-auto"
          >
            Edit Knowledge Base
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
            <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Company / Brand Name</span>
            <span className="font-syne text-sm font-black text-[#1a1a1a]">
              {user?.bussinessName || "Not configured"}
            </span>
          </div>
          <div className="p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
            <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Industry / Category</span>
            <span className="font-syne text-sm font-black text-[#1a1a1a]">
              {user?.bussinessCategory || "General Customer Support"}
            </span>
          </div>
          <div className="p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
            <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Chatbot Token</span>
            <span className="font-mono text-xs font-bold text-[#1a1a1a] truncate block">
              {user?.chatbot_token || "Token unavailable"}
            </span>
          </div>
        </div>

        {user?.bussinessDescription && (
          <div className="p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a] mb-6">
            <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Company Description</span>
            <p className="text-xs font-medium text-gray-800 leading-relaxed">
              {user.bussinessDescription}
            </p>
          </div>
        )}

        {/* FAQs Sample */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase text-[#1a1a1a]">
              Trained Questions ({questionsCount})
            </span>
            <span className="text-[11px] font-bold text-gray-500">
              The AI answers these questions in real time
            </span>
          </div>

          {questionsCount === 0 ? (
            <div className="p-6 bg-[#FDF9F0] border-2 border-[#1a1a1a] text-center">
              <p className="text-xs font-bold text-gray-600 mb-2">No company questions added yet.</p>
              <button
                onClick={() => onNavigateTab("business details")}
                className="px-3 py-1.5 bg-[#BFF000] border-2 border-[#1a1a1a] font-black text-xs uppercase"
              >
                + Add Your First Question
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {user.bussinessDetails.slice(0, 5).map((faq, idx) => (
                <div key={idx} className="p-2.5 bg-[#FDF9F0] border border-[#1a1a1a] flex flex-col gap-1">
                  <div className="text-xs font-black text-[#1a1a1a] flex items-center gap-1.5">
                    <span className="text-[#FF4D00]">Q:</span> {faq.question}
                  </div>
                  <div className="text-[11px] font-medium text-gray-700 truncate">
                    <span className="font-bold text-[#2D31FA]">A:</span> {faq.answer}
                  </div>
                </div>
              ))}
              {questionsCount > 5 && (
                <button
                  onClick={() => onNavigateTab("business details")}
                  className="text-xs font-bold text-[#2D31FA] hover:underline text-left pt-1"
                >
                  + View and manage all {questionsCount} questions in Business Details →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}