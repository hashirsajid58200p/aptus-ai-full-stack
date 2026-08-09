"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"

function PaintbrushUnderline() {
  return (
    <svg
      className="absolute -bottom-3 left-0 w-full h-6"
      viewBox="0 0 300 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 12C20 6 40 10 60 8C80 6 100 12 120 10C140 8 160 5 180 7C200 9 220 14 240 11C260 8 280 6 298 10"
        stroke="#2563eb"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: "url(#roughen)",
        }}
      />
      <defs>
        <filter id="roughen">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/tradecraft-fm-emerging-market-ar-169-stylize-200-v-7-4320fa46-3253-4d51-a195-020395b794bd-1.png"
          alt="Bull silhouette against city skyline"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-[#0a1628]/70" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center py-32">
        <h1
          className={`font-serif text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight text-balance mb-8 leading-[1.1] text-white transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          Where Vision Meets
          <br />
          <span className="relative inline-block italic">
            Capital
            <PaintbrushUnderline />
          </span>
        </h1>

        <p
          className={`text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-14 text-pretty leading-relaxed transition-all duration-700 ease-out delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          We partner with ambitious founders and management teams to unlock growth, navigate complexity, and build
          enduring market leaders. $2.8B+ deployed across 47 portfolio companies.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out delay-[400ms] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Button
            size="lg"
            className="rounded-none px-10 min-h-[56px] text-[13px] font-medium tracking-wide uppercase gap-3 bg-white text-[#0a1628] hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Explore Partnership
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-none px-10 min-h-[56px] text-[13px] font-medium tracking-wide uppercase bg-transparent border-white/30 text-white hover:bg-white hover:text-[#0a1628]"
          >
            Our Track Record
          </Button>
        </div>
      </div>
    </section>
  )
}
