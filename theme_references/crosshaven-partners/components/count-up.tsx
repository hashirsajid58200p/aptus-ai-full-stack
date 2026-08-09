"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  value: string
  duration?: number
}

export function CountUp({ value, duration = 2000 }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState("0")
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateValue()
          }
        })
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateValue = () => {
    // Parse the value to extract number, prefix, and suffix
    const match = value.match(/^([^\d]*)([\d.]+)([^\d]*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const prefix = match[1] // e.g., "$"
    const numericPart = Number.parseFloat(match[2]) // e.g., 2.8
    const suffix = match[3] // e.g., "B+"
    const hasDecimal = match[2].includes(".")
    const decimalPlaces = hasDecimal ? match[2].split(".")[1].length : 0

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)

      const currentValue = numericPart * easeOut
      const formattedValue = hasDecimal ? currentValue.toFixed(decimalPlaces) : Math.floor(currentValue).toString()

      setDisplayValue(`${prefix}${formattedValue}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }

  return <span ref={ref}>{displayValue}</span>
}
