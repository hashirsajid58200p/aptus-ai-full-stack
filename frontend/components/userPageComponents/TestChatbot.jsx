import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Send } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import baseurl from "@/store/baseurl";

const TestChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "Bot", message: "Hello! How can I assist you with your business queries today?" },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const newMessages = [...messages, { sender: "You", message: messageInput }];
      setMessages(newMessages);
      setMessageInput("");
      setLoading(true);

      // Pair user questions with bot answers cleanly, skipping initial welcome greeting offset
      const conversationHistory = messages.filter((msg, idx) => !(idx === 0 && msg.sender === "Bot"));
      const formattedMessages = [];
      for (let i = 0; i < conversationHistory.length - 1; i += 2) {
        const userMsg = conversationHistory[i];
        const botMsg = conversationHistory[i + 1];
        if (userMsg && userMsg.sender === "You" && botMsg && botMsg.sender === "Bot") {
          formattedMessages.push({
            question: userMsg.message,
            answer: botMsg.message,
          });
        }
      }

      try {
        setMessages(prev => [...prev, { sender: "Bot", message: "Typing..." }]);

        const response = await fetch(`${baseurl}/chatbot/test/owner`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            message: messageInput,
            messages: formattedMessages,
          }),
        });

        const data = await response.json();

        setMessages(prev =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { sender: "Bot", message: data.data }
              : msg
          )
        );
      } catch (error) {
        console.error("Error:", error);
        setMessages(prev => [...prev, { sender: "Bot", message: "Sorry, something went wrong." }]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-4 sm:p-6">
      <div className="flex items-center gap-3 border-b-2 border-[#1a1a1a] pb-3 mb-4">
        <span className="bg-[#FF4D00] text-white border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase">
          Live Sandbox
        </span>
        <h3 className="font-syne text-2xl font-extrabold text-[#1a1a1a] uppercase">
          Test Aptus AI Chatbot
        </h3>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto mb-4 p-4 bg-[#FDF9F0] border-2 border-[#1a1a1a] min-h-[60vh] max-h-[65vh]">
        {messages.map((chat, index) => (
          <div
            key={index}
            className={`mb-4 max-w-[85%] ${
              chat.sender === "You" ? "ml-auto text-right" : "mr-auto text-left"
            }`}
          >
            <span
              className={`inline-block p-3 font-semibold text-sm border-2 border-[#1a1a1a] shadow-neo-sm ${
                chat.sender !== "You"
                  ? "bg-white text-[#1a1a1a]"
                  : "bg-[#2D31FA] text-white"
              }`}
            >
              {chat.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Ask your trained Aptus AI assistant..."
          className="flex-1 p-3 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] font-medium placeholder-gray-500 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-[#BFF000] border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] text-[#1a1a1a] font-bold disabled:opacity-50 transition-all"
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TestChatbot;
