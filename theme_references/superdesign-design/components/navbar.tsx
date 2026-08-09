"use client"

import { Menu, Twitter, Instagram } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:px-8">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-serif text-2xl font-bold uppercase tracking-tighter mix-blend-difference text-white md:text-black">
          Superdesign®
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-4 bg-black/90 p-2 rounded-full backdrop-blur-sm border border-white/10">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-colors uppercase ${
              pathname === item.href
                ? "bg-white text-black"
                : "bg-transparent text-white hover:bg-white hover:text-black"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button className="md:hidden p-2 bg-black text-white rounded-full">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex gap-2">
          {[Twitter, Instagram].map((Icon, i) => (
            <button
              key={i}
              className="p-3 bg-black text-white rounded-full hover:bg-white hover:text-black transition-colors border border-black"
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
