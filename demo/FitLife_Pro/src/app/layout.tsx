import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatBotWrapper from "@/components/ChatBotWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitLife Pro | Modern Elite Fitness Club & Gym",
  description: "Join FitLife Pro, the premium elite fitness club. Experience world-class equipment, personalized coaching, and inspiring group classes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-950 text-neutral-100 flex flex-col">
        {children}
        {/* Render ChatBotWrapper for persistent site-wide access */}
        <ChatBotWrapper />
      </body>
    </html>
  );
}
