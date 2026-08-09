"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const LOGO_URL = "/images/crosshaven-logo.svg"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#team", label: "Team" },
  { href: "/insights", label: "Insights" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl transition-all duration-700 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${hasLoaded ? "opacity-100" : "opacity-0 -translate-y-4"}`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-black/50" />

      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 px-6 lg:px-8 py-5">
          <Image
            src={LOGO_URL || "/placeholder.svg"}
            alt="Crosshaven"
            width={180}
            height={58}
            className="h-10 w-auto"
            priority
            unoptimized
          />
        </Link>

        <div className="hidden md:flex items-center gap-10 ml-auto mr-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-[2px] h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-500 ease-in-out" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex self-stretch min-w-[200px]">
          <Button className="group rounded-none w-full h-full text-[13px] font-medium tracking-wide uppercase justify-center hover:bg-foreground">
            Contact Us
            <ArrowUpRight
              className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-in-out"
              strokeWidth={1}
            />
          </Button>
        </div>

        <button
          className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center mr-4"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border/50">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-[13px] font-medium text-muted-foreground hover:text-foreground py-3 tracking-wide uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button className="group w-full rounded-none mt-6 py-5 text-[13px] font-medium tracking-wide uppercase hover:bg-foreground">
              Contact Us
              <ArrowUpRight
                className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-in-out"
                strokeWidth={1}
              />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
