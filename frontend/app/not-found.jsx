"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="text-[#1a1a1a] min-h-screen flex flex-col items-center justify-center bg-[#FDF9F0] py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Top Left Navigation Button */}
      <div className="absolute top-5 left-5">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform cursor-pointer font-space font-extrabold text-xs uppercase"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 text-[#1a1a1a]" />
          <span>Home</span>
        </button>
      </div>

      {/* Main 404 Neo-Brutalist Card */}
      <div className="max-w-md w-full bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-8 sm:p-10 text-center space-y-6">
        
        {/* Aptus Logo */}
        <div className="flex justify-center">
          <img
            src="/aptus-logo.png"
            alt="Aptus AI"
            className="h-12 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/")}
          />
        </div>

        {/* Status Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#FF4D00] text-white border-2 border-[#1a1a1a] text-[11px] font-extrabold uppercase px-3 py-1 shadow-neo-sm font-space tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            ERROR 404 · PAGE NOT FOUND
          </span>
        </div>

        {/* 404 Hero Number */}
        <h1 className="font-syne text-7xl sm:text-8xl font-black text-[#1a1a1a] tracking-tight uppercase leading-none">
          404
        </h1>

        {/* Heading and Description */}
        <div className="space-y-2">
          <h2 className="font-syne text-xl font-extrabold uppercase text-[#1a1a1a]">
            Oops! Page Missing
          </h2>
          <p className="font-space font-bold text-xs sm:text-sm text-gray-700 leading-relaxed max-w-xs mx-auto">
            The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-[#1a1a1a]" />

        {/* Back to Home CTA Button */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#BFF000] hover:bg-[#a6d000] text-[#1a1a1a] font-extrabold font-space text-xs sm:text-sm uppercase tracking-wider border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      {/* Footer copyright */}
      <p className="mt-8 text-center text-[11px] font-extrabold font-space text-[#1a1a1a]/50 uppercase tracking-wider">
        © {new Date().getFullYear()} Aptus AI. All Rights Reserved.
      </p>
    </div>
  );
}
