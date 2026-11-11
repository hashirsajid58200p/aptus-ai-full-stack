"use client";

import dynamic from "next/dynamic";

// Dynamically import ChatBot from aptus-ai-chatbot-widget to avoid SSR issues in Next.js
const ChatBot = dynamic(
  () => import("aptus-ai-chatbot-widget").then((mod) => mod.ChatBot),
  {
    ssr: false,
  }
);

export default function ChatBotWrapper() {
  const apiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3100/api/v1'
    : `${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1`;

  return (
    <ChatBot
      token="A1ED-E8E08127-D535E9F7"
      apiUrl={apiUrl}
      wantToShowSuggestions={true}
    />
  );
}
