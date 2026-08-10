import React, { useState, useEffect } from "react";
import { MessageSquare, User, Mail, Calendar, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import baseurl from "@/store/baseurl";
import toast from "react-hot-toast";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState(null);

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
        setSessions(data.sessions || []);
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

  const toggleExpand = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-6 bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6">
      <div className="flex items-center justify-between border-b-3 border-[#1a1a1a] pb-4">
        <div>
          <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase mr-3">
            Analytics & Logs
          </span>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#1a1a1a] uppercase inline-block">
            Customer Chat Sessions
          </h2>
        </div>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm font-extrabold text-sm uppercase hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF4D00] border-t-transparent"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center p-12 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-syne text-xl font-bold uppercase text-[#1a1a1a] mb-1">No Chat Sessions Found</h3>
          <p className="text-gray-600 font-medium text-sm">
            Once customers start interacting with your website chatbot widget, their conversations will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => {
            const isExpanded = expandedSessionId === session._id;

            return (
              <div
                key={session._id}
                className="border-2 border-[#1a1a1a] bg-[#FDF9F0] shadow-neo-sm transition-all overflow-hidden"
              >
                {/* Session Header */}
                <div
                  onClick={() => toggleExpand(session._id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-white transition-colors gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#2D31FA] text-white border-2 border-[#1a1a1a] flex items-center justify-center font-extrabold">
                      {session.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-lg text-[#1a1a1a] flex items-center gap-2">
                        <User className="w-4 h-4 text-[#FF4D00]" />
                        {session.username || "Anonymous User"}
                      </h4>
                      <p className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" />
                        {session.email || "No email provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(session.createdAt).toLocaleDateString()} {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="inline-block mt-1 bg-[#BFF000] text-[#1a1a1a] border border-[#1a1a1a] px-2 py-0.5 text-xs font-extrabold uppercase">
                        {session.messages?.length || 0} Messages
                      </span>
                    </div>

                    <button className="p-1 border border-[#1a1a1a] bg-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Session Detailed Transcript */}
                {isExpanded && (
                  <div className="p-4 border-t-2 border-[#1a1a1a] bg-white">
                    <h5 className="font-syne font-bold text-xs uppercase text-gray-500 mb-3 tracking-wider">
                      Transcript History
                    </h5>
                    {session.messages && session.messages.length > 0 ? (
                      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto p-2 bg-[#FDF9F0] border-2 border-[#1a1a1a]">
                        {session.messages.map((msg, index) => (
                          <div
                            key={msg._id || index}
                            className={`flex flex-col max-w-[85%] ${
                              msg.role === "user" ? "ml-auto text-right" : "mr-auto text-left"
                            }`}
                          >
                            <span className="text-[10px] font-extrabold uppercase text-gray-500 mb-0.5">
                              {msg.role === "user" ? session.username || "User" : "Chatbot"}
                            </span>
                            <div
                              className={`p-3 text-sm font-semibold border-2 border-[#1a1a1a] shadow-neo-sm ${
                                msg.role === "user"
                                  ? "bg-[#2D31FA] text-white"
                                  : "bg-white text-[#1a1a1a]"
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-500 italic">No messages logged in this session.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Sessions;
