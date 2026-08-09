"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const ICON_URL = "/images/crosshaven-icon.svg"

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center transition-opacity duration-[400ms] ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.44, 0, 0.56, 1)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <Image
          src={ICON_URL || "/placeholder.svg"}
          alt="Crosshaven"
          width={64}
          height={64}
          className="w-16 h-16"
          priority
          unoptimized
        />

        <div className="w-48 h-[1px] bg-border overflow-hidden">
          <div
            className="h-full bg-accent animate-loading-bar"
            style={{
              animation: "loading-bar 2.8s cubic-bezier(0.44, 0, 0.56, 1) infinite",
            }}
          />
        </div>

        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Crosshaven</p>
      </div>
    </div>
  )
}
