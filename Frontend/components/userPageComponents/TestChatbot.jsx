import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Send } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import baseurl from "@/store/baseurl";

const TestChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "Bot", message: "Hello! How can I assist you today?" },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);


  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
const handleSendMessage = async () => {
  if (messageInput.trim()) {
    const newMessages = [...messages, { sender: "You", message: messageInput }];
    setMessages(newMessages);
    setMessageInput("");
    setLoading(true);

    // ✅ Correctly format only actual Q&A pairs
    const formattedMessages = [];
    for (let i = 0; i < messages.length - 1; i += 2) {
      const userMsg = messages[i];
      const botMsg = messages[i + 1];
      if (userMsg && botMsg) {
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
          messages: formattedMessages, // ✅ clean history
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
    <div className="flex flex-col h-full p-4 bg-gray-100 rounded-lg">
      <ScrollArea className="flex-1 overflow-y-auto mb-2 p-4 bg-white shadow-md rounded-lg min-h-[70vh]">
        {messages.map((chat, index) => (
          <div
            key={index}
            className={`mb-4 max-w-[90%]   ${
              chat.sender === "You" ? "ml-auto text-right" : "mr-auto text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                chat.sender != "You" ? "bg-gray-100 text-black" : "bg-purple-600 text-white"
              } `}
            >
              {chat.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="flex items-center mt-4">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg bg-white shadow-md border border-gray-300 focus:ring focus:ring-purple-300"
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors"
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TestChatbot;
