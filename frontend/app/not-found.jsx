"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF9F0] flex flex-col items-center justify-center px-6 py-16">

      {/* Error badge */}
      <div className="mb-8 px-3 py-1 bg-[#FF4D00] border-2 border-[#1a1a1a] inline-block">
        <span className="text-white text-[11px] font-extrabold uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          404 · Page Not Found
        </span>
      </div>

      {/* 404 number */}
      <h1
        className="text-[140px] sm:text-[180px] font-extrabold leading-none select-none mb-4"
        style={{
          fontFamily: "'Syne', sans-serif",
          color: "#1a1a1a",
          WebkitTextStroke: "3px #FF4D00",
        }}
      >
        404
      </h1>

      {/* Headline */}
      <h2
        className="text-2xl sm:text-3xl font-extrabold uppercase text-[#1a1a1a] mb-3 text-center"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Oops! Page Missing
      </h2>

      {/* Description */}
      <p
        className="text-sm font-bold text-[#1a1a1a]/60 text-center max-w-sm mb-10"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>

      {/* Back to Home button only */}
      <Link
        href="/"
        className="flex items-center gap-2 px-8 py-3.5 bg-[#BFF000] text-[#1a1a1a] font-extrabold text-sm uppercase tracking-wider border-3 border-[#1a1a1a] shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        ← Back to Home
      </Link>

    </div>
  );
}
