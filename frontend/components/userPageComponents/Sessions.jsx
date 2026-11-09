"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  User,
  Mail,
  Calendar,
  Clock,
  Search,
  RefreshCw,
  Download,
  Copy,
  ChevronRight,
  Bot,
  Headphones,
  Check,
  Filter,
} from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseurl}/session/owner/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        const list = data.sessions || [];
        setSessions(list);
        if (list.length > 0 && !selectedSessionId) {
          setSelectedSessionId(list[0]._id);
        }
      } else {
        toast.error(data.message || "Failed to load sessions");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Filter sessions by search term (username, email, or message content)
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => {
      const matchName = (s.username || "").toLowerCase().includes(q);
      const matchEmail = (s.email || "").toLowerCase().includes(q);
      const matchMessage = Array.isArray(s.messages) && s.messages.some((m) =>
        (m.message || "").toLowerCase().includes(q)
      );
      return matchName || matchEmail || matchMessage;
    });
  }, [sessions, searchQuery]);

  // Active selected session
  const activeSession = useMemo(() => {
    if (!selectedSessionId) return sessions[0] || null;
    return sessions.find((s) => s._id === selectedSessionId) || sessions[0] || null;
  }, [sessions, selectedSessionId]);

  const handleCopyTranscript = () => {
    if (!activeSession || !activeSession.messages) return;
    const text = activeSession.messages
      .map((m) => `${m.role === "user" ? activeSession.username || "Visitor" : "Aptus AI"}: ${m.message}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Transcript copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 md:p-6 min-h-[750px]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-3 border-[#1a1a1a] pb-4 gap-4">
        <div>
          <span className="bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3 inline-block">
            INBOX & LOGS
          </span>
          <h2 className="font-syne text-xl md:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block mt-1 sm:mt-0">
            Customer Conversations
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.open(`${baseurl}/session/owner/export`, "_blank");
              toast.success("Downloading Chat Logs CSV...");
            }}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:translate-x-0.5 transition-transform"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:translate-x-0.5 transition-transform disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Statistics Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, or message keyword..."
            className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#1a1a1a] text-xs font-medium placeholder-gray-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
          <span>Total: <strong className="text-[#1a1a1a]">{sessions.length}</strong></span>
          <span>Showing: <strong className="text-[#1a1a1a]">{filteredSessions.length}</strong></span>
        </div>
      </div>

      {/* Main Inbox Workspace: Split Master-Detail Layout */}
      {loading ? (
        <div className="flex justify-center items-center p-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF4D00]"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center p-16 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-syne text-xl font-bold uppercase text-[#1a1a1a] mb-1">No Chat Sessions Found</h3>
          <p className="text-gray-600 font-medium text-xs max-w-md mx-auto">
            Once customers start interacting with your website chatbot widget, their conversations will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 border-2 border-[#1a1a1a] bg-white min-h-[550px]">
          {/* Left Column: Conversation List */}
          <div className="lg:col-span-5 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col max-h-[600px] overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-gray-500">
                No conversations match your search.
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isSelected = activeSession?._id === session._id;
                const messagesList = session.messages || [];
                const lastMessage = messagesList.length > 0 ? messagesList[messagesList.length - 1].message : "No messages";
                const dateStr = session.createdAt ? new Date(session.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }) : "";
                const timeStr = session.createdAt ? new Date(session.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

                return (
                  <div
                    key={session._id}
                    onClick={() => setSelectedSessionId(session._id)}
                    className={`p-3.5 border-b border-[#1a1a1a] cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-white border-l-4 border-l-[#FF4D00] shadow-sm"
                        : "hover:bg-white/80"
                    }`}
                  >
                    {/* User Avatar Initial */}
                    <div className="w-9 h-9 shrink-0 bg-[#2D31FA] text-white border border-[#1a1a1a] flex items-center justify-center font-black text-xs uppercase">
                      {session.username?.charAt(0) || "U"}
                    </div>

                    {/* Metadata & Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-syne font-bold text-xs uppercase text-[#1a1a1a] truncate">
                          {session.username || "Website Visitor"}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">
                          {dateStr} {timeStr}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-500 truncate mb-1">
                        {session.email || "visitor@web.local"}
                      </div>

                      <p className="text-xs font-medium text-gray-700 truncate line-clamp-1">
                        {lastMessage}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#BFF000] border border-[#1a1a1a] text-[#1a1a1a]">
                          {messagesList.length} msgs
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Chat Transcript View */}
          <div className="lg:col-span-7 flex flex-col bg-white">
            {activeSession ? (
              <div className="flex flex-col h-full">
                {/* Active Session Header */}
                <div className="p-4 border-b-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                      <h4 className="font-syne font-black text-sm uppercase text-[#1a1a1a]">
                        {activeSession.username || "Website Visitor"}
                      </h4>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 flex items-center gap-3 mt-1">
                      <span>{activeSession.email || "No email provided"}</span>
                      {activeSession.phone && <span>Phone: {activeSession.phone}</span>}
                    </div>
                  </div>

                  <button
                    onClick={handleCopyTranscript}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase hover:bg-gray-100 transition-colors self-start sm:self-auto"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Transcript"}</span>
                  </button>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-3.5 max-h-[480px] bg-[#FAF8F5]">
                  {!activeSession.messages || activeSession.messages.length === 0 ? (
                    <div className="p-8 text-center text-xs font-bold text-gray-400 italic">
                      No message exchanges recorded in this session.
                    </div>
                  ) : (
                    activeSession.messages.map((msg, idx) => {
                      const isUser = msg.role === "user" || msg.sender === "user";
                      return (
                        <div
                          key={msg._id || idx}
                          className={`flex flex-col max-w-[85%] ${
                            isUser ? "ml-auto items-end" : "mr-auto items-start"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-500 mb-1">
                            {isUser ? (
                              <>
                                <span>{activeSession.username || "Visitor"}</span>
                                <User className="w-3 h-3 text-[#2D31FA]" />
                              </>
                            ) : msg.sender === "human_agent" ? (
                              <>
                                <Headphones className="w-3 h-3 text-[#FF4D00]" />
                                <span className="text-[#FF4D00]">Live Support Agent</span>
                              </>
                            ) : (
                              <>
                                <Bot className="w-3 h-3 text-[#10b981]" />
                                <span>Aptus AI Assistant</span>
                              </>
                            )}
                          </div>

                          <div
                            className={`p-3 text-xs md:text-sm font-medium border-2 border-[#1a1a1a] shadow-neo-sm leading-relaxed ${
                              isUser
                                ? "bg-[#2D31FA] text-white"
                                : "bg-white text-[#1a1a1a]"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-400">
                <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
                <span className="font-syne font-bold text-sm uppercase">Select a conversation from the left to view</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}