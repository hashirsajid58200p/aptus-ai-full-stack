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
  return (
    <ChatBot
      token="A1ED-E8E08127-D535E9F7"
      apiUrl="https://aptus-ai-full-stack.vercel.app/api/v1"
      theme="chatgpt"
      wantToShowSuggestions={true}
    />
  );
}
