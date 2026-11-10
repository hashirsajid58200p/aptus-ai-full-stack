"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  MessageSquare,
  User,
  Search,
  RefreshCw,
  Download,
  Copy,
  Bot,
  Headphones,
  Check,
  Send,
} from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const formatMessageTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const getMessageDateKey = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const formatDateDivider = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const now = new Date();

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [takeoverLoading, setTakeoverLoading] = useState(false);
  const [agentInput, setAgentInput] = useState("");
  const [sendingAgentMsg, setSendingAgentMsg] = useState(false);
  const messagesEndRef = useRef(null);

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

  // Chronologically sorted messages: previous at the top, newly sent below
  const sortedMessages = useMemo(() => {
    if (!activeSession || !activeSession.messages) return [];
    return [...activeSession.messages].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
  }, [activeSession]);

  const handleCopyTranscript = () => {
    if (!sortedMessages || sortedMessages.length === 0) return;
    const text = sortedMessages
      .map((m) => `${m.role === "user" ? activeSession.username || "Visitor" : "Aptus AI"}: ${m.message}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Transcript copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTakeoverToggle = async () => {
    if (!activeSession) return;
    const isHumanActive = activeSession.status === "human_active";
    const nextAction = isHumanActive ? "handback" : "takeover";
    setTakeoverLoading(true);
    try {
      const res = await fetch(`${baseurl}/session/takeover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: activeSession._id,
          action: nextAction,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newStatus = data.status;
        setSessions((prev) =>
          prev.map((s) => (s._id === activeSession._id ? { ...s, status: newStatus } : s))
        );
        toast.success(
          newStatus === "human_active"
            ? "Live Agent mode active! AI auto-replies paused."
            : "Handed conversation back to AI assistant."
        );
      } else {
        toast.error(data.message || "Failed to update session mode");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to server");
    } finally {
      setTakeoverLoading(false);
    }
  };

  const handleSendAgentMessage = async (e) => {
    e?.preventDefault();
    if (!activeSession || !agentInput.trim() || sendingAgentMsg) return;
    const textToSend = agentInput.trim();
    setSendingAgentMsg(true);
    try {
      const res = await fetch(`${baseurl}/session/agent-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: activeSession._id,
          message: textToSend,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        const createdMsg = data.message;
        setSessions((prev) =>
          prev.map((s) => {
            if (s._id === activeSession._id) {
              const updatedMsgs = [...(s.messages || []), createdMsg];
              return {
                ...s,
                status: "human_active",
                messages: updatedMsgs,
                updatedAt: new Date().toISOString(),
              };
            }
            return s;
          })
        );
        setAgentInput("");
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        toast.success("Reply sent to visitor!");
      } else {
        toast.error(data.message || "Failed to send agent reply");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending message");
    } finally {
      setSendingAgentMsg(false);
    }
  };

  return (
    <div className="bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 sm:p-8 flex flex-col gap-6">
      {/* Top Actions */}
      <div className="flex items-center justify-end border-b-2 border-[#1a1a1a] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.open(`${baseurl}/session/owner/export`, "_blank");
              toast.success("Downloading Chat Logs CSV...");
            }}
            className="px-3 sm:px-4 py-2 bg-[#BFF000] text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="px-3 sm:px-4 py-2 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-xs uppercase hover:bg-gray-50 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#1a1a1a] text-xs font-medium placeholder-gray-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
          <span>Total: <strong className="text-[#1a1a1a]">{sessions.length}</strong></span>
        </div>
      </div>

      {/* Main Inbox Workspace: Split Master-Detail Layout */}
      {loading ? (
        <div className="flex justify-center items-center p-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF4D00]"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center p-12 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
          <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h4 className="font-syne text-base font-bold uppercase text-[#1a1a1a]">No Sessions Yet</h4>
          <p className="text-gray-600 font-medium text-xs mt-1">
            Visitor conversations will appear here when customers chat with your widget.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-3 border-[#1a1a1a] shadow-neo-lg bg-[#FDF9F0] overflow-hidden">
          {/* Left Column: Conversation List */}
          <div className="lg:col-span-5 border-b-3 lg:border-b-0 lg:border-r-3 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-gray-500">
                  No conversations match your search.
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isSelected = activeSession?._id === session._id;
                  const messagesList = session.messages || [];
                  const lastMessage = messagesList.length > 0 ? messagesList[messagesList.length - 1].message : "No messages";
                  const lastTime = (messagesList.length > 0 && messagesList[messagesList.length - 1].createdAt) || session.updatedAt || session.createdAt;
                  const dateStr = lastTime ? new Date(lastTime).toLocaleDateString([], { month: "short", day: "numeric" }) : "";
                  const timeStr = lastTime ? new Date(lastTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

                  return (
                    <div
                      key={session._id}
                      onClick={() => setSelectedSessionId(session._id)}
                      className={`p-3.5 border-b border-[#1a1a1a] cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-white border-l-4 border-l-[#FF4D00] shadow-sm"
                          : "hover:bg-white/70"
                      }`}
                    >
                      {/* User Avatar Initial */}
                      <div className="w-8 h-8 shrink-0 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm flex items-center justify-center font-black text-xs uppercase">
                        {session.username?.charAt(0) || "U"}
                      </div>

                      {/* Metadata & Preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-syne font-bold text-xs uppercase text-[#1a1a1a] truncate">
                            {session.username || "Website Visitor"}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono shrink-0 font-semibold">
                            {dateStr} {timeStr}
                          </span>
                        </div>

                        <div className="text-[11px] text-gray-500 truncate mb-1">
                          {session.email || "visitor@web.local"}
                        </div>

                        <p className="text-xs font-medium text-gray-700 truncate line-clamp-1">
                          {lastMessage}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#BFF000] border border-[#1a1a1a] text-[#1a1a1a]">
                              {messagesList.length} msgs
                            </span>
                            {session.status === "human_active" && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-[#2563EB] text-white border border-[#1a1a1a]">
                                LIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-gray-400">
                            ID: #{session._id.slice(-5).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat Transcript View */}
          <div className="lg:col-span-7 flex flex-col bg-[#FDF9F0] h-[600px]">
            {activeSession ? (
              <div className="flex flex-col h-full">
                {/* Active Session Header */}
                <div className="p-3.5 sm:p-4 border-b-2 border-[#1a1a1a] bg-[#FDF9F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0"></span>
                      <h4 className="font-syne font-black text-sm uppercase text-[#1a1a1a] truncate">
                        {activeSession.username || "Website Visitor"}
                      </h4>
                      <span className="font-mono text-[10px] font-black px-2 py-0.5 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm text-[#1a1a1a] uppercase tracking-wider shrink-0">
                        ID: #{activeSession._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 flex items-center gap-3 mt-1 truncate">
                      <span>{activeSession.email || "No email provided"}</span>
                      {activeSession.phone && <span>Phone: {activeSession.phone}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {activeSession.status === "human_active" ? (
                      <button
                        onClick={handleTakeoverToggle}
                        disabled={takeoverLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                        title="Live Agent is active. Click to hand back to AI."
                      >
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        <Bot className="w-3.5 h-3.5" />
                        <span>Hand Back to AI</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleTakeoverToggle}
                        disabled={takeoverLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Headphones className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Take Over Chat</span>
                      </button>
                    )}

                    <button
                      onClick={handleCopyTranscript}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto no-scrollbar flex flex-col gap-3.5 bg-[#FAF8F5]">
                  {sortedMessages.length === 0 ? (
                    <div className="p-8 text-center text-xs font-bold text-gray-400 italic">
                      No message exchanges recorded in this session.
                    </div>
                  ) : (
                    sortedMessages.map((msg, idx) => {
                      const isUser = msg.role === "user" || msg.sender === "user";
                      const msgTime = msg.createdAt || activeSession.createdAt;
                      const currentDateKey = getMessageDateKey(msgTime);
                      const prevDateKey =
                        idx > 0
                          ? getMessageDateKey(
                              sortedMessages[idx - 1].createdAt || activeSession.createdAt
                            )
                          : null;
                      const showDateDivider = currentDateKey && currentDateKey !== prevDateKey;

                      return (
                        <React.Fragment key={msg._id || idx}>
                          {showDateDivider && (
                            <div className="w-full flex items-center justify-center my-3 shrink-0">
                              <span className="px-3 py-1 bg-white border-2 border-[#1a1a1a] shadow-neo-sm text-[10px] font-mono font-black uppercase text-[#1a1a1a] tracking-wider">
                                {formatDateDivider(msgTime)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex flex-col max-w-[85%] ${
                              isUser ? "ml-auto items-end" : "mr-auto items-start"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-gray-500 mb-1">
                              {isUser ? (
                                <>
                                  <span>{activeSession.username || "Visitor"}</span>
                                  <User className="w-3 h-3 text-[#FF4D00]" />
                                </>
                              ) : msg.sender === "human_agent" ? (
                                <>
                                  <Headphones className="w-3 h-3 text-[#2563EB]" />
                                  <span className="text-[#2563EB]">Live Support Agent</span>
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
                                  ? "bg-[#FF4D00] text-white"
                                  : "bg-white text-[#1a1a1a]"
                              }`}
                            >
                              <MarkdownRenderer content={msg.message} isUser={isUser} />
                              <span
                                className={`text-[9px] font-mono mt-1.5 block text-right font-bold ${
                                  isUser ? "text-orange-200" : "text-gray-400"
                                }`}
                              >
                                {formatMessageTime(msgTime)}
                              </span>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Live Agent Direct Reply Input */}
                <form
                  onSubmit={handleSendAgentMessage}
                  className="p-3 bg-[#FDF9F0] border-t-2 border-[#1a1a1a] flex items-center gap-2 shrink-0"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={agentInput}
                      onChange={(e) => setAgentInput(e.target.value)}
                      placeholder={
                        activeSession.status === "human_active"
                          ? "Type live reply to visitor as support agent..."
                          : "Take over chat or send direct agent reply..."
                      }
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1a1a1a] text-xs font-bold text-[#1a1a1a] placeholder-gray-500 outline-none shadow-neo-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingAgentMsg || !agentInput.trim()}
                    className="px-4 py-2.5 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] shadow-neo-sm font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-orange-600 transition-all disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {sendingAgentMsg ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">Send Reply</span>
                  </button>
                </form>
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