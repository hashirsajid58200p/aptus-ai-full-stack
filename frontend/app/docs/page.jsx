// TODO: replace with full professional docs (installation, theming, API reference, examples)

"use client";

import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDF9F0] text-[#1a1a1a] flex flex-col items-center justify-center p-6 relative">
      {/* Top Navbar Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white text-[#1a1a1a] font-extrabold border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform uppercase text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Main Neo-Brutalist Docs Card */}
      <div className="max-w-2xl w-full bg-white border-3 border-[#1a1a1a] p-8 md:p-12 shadow-neo-lg text-center space-y-6 relative">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#BFF000] text-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo-sm mb-2">
          <BookOpen className="w-8 h-8 text-[#1a1a1a]" />
        </div>

        <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#1a1a1a] uppercase tracking-tight">
          DOCS. <span className="text-[#FF4D00]">COMING SOON.</span>
        </h1>

        <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed max-w-lg mx-auto">
          Full setup instructions, widget theming options, API reference, and integration examples are currently on their way!
        </p>

        <div className="pt-4">
          <button
            onClick={() => router.push("/")}
            className="btn-neo-primary px-8 py-3 text-sm font-extrabold uppercase inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO HOMEPAGE
          </button>
        </div>
      </div>
    </div>
  );
}
