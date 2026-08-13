"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF9F0] flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

      {/* Background decorative grid lines */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />

      {/* Floating accent blobs */}
      <div className="absolute top-12 left-10 w-20 h-20 bg-[#BFF000] border-3 border-[#1a1a1a] shadow-neo rotate-12 opacity-60" />
      <div className="absolute bottom-16 right-12 w-16 h-16 bg-[#FF4D00] border-3 border-[#1a1a1a] shadow-neo -rotate-6 opacity-60" />
      <div className="absolute top-1/3 right-8 w-10 h-10 bg-[#2D31FA] border-2 border-[#1a1a1a] shadow-neo-sm rotate-45 opacity-40" />
      <div className="absolute bottom-1/3 left-8 w-8 h-8 bg-[#1a1a1a] rotate-12 opacity-20" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg">

        {/* Top label */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#FF4D00] border-2 border-[#1a1a1a] shadow-neo-sm">
          <span className="text-white text-[11px] font-extrabold font-space uppercase tracking-widest">
            Error · Page Not Found
          </span>
        </div>

        {/* 404 hero text */}
        <div className="bg-[#1a1a1a] border-3 border-[#1a1a1a] shadow-neo-lg p-8 mb-6">
          <div className="flex items-baseline gap-2 mb-4">
            <span
              className="text-[120px] font-extrabold leading-none select-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "#BFF000",
                textShadow: "4px 4px 0px #FF4D00",
              }}
            >
              404
            </span>
          </div>
          <h1
            className="text-2xl font-extrabold uppercase text-white mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Oops! Page Missing
          </h1>
          <p className="text-sm font-bold text-white/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#BFF000] text-[#1a1a1a] font-extrabold text-sm uppercase tracking-wider border-3 border-[#1a1a1a] shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ← Back to Home
          </Link>
          <Link
            href="/start"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#1a1a1a] font-extrabold text-sm uppercase tracking-wider border-3 border-[#1a1a1a] shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Bottom hint */}
        <p className="mt-6 text-center text-xs font-bold text-[#1a1a1a]/40" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          If you think this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
