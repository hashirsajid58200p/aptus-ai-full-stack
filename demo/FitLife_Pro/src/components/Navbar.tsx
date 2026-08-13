"use client";

import { useState } from "react";
import { CloseIcon, MenuIcon } from "./Icons";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
            FITLIFE PRO
          </span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#classes" className="transition-colors hover:text-white">Classes</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          <a href="#faqs" className="transition-colors hover:text-white">FAQs</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a 
            href="#pricing" 
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 transition-all duration-300 transform hover:scale-[1.03] shadow-md shadow-lime-950/20"
          >
            Join Club
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-neutral-400 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-900 bg-neutral-950 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-neutral-400">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="transition-colors hover:text-white"
            >
              Features
            </a>
            <a 
              href="#classes" 
              onClick={() => setMobileMenuOpen(false)}
              className="transition-colors hover:text-white"
            >
              Classes
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="transition-colors hover:text-white"
            >
              Pricing
            </a>
            <a 
              href="#faqs" 
              onClick={() => setMobileMenuOpen(false)}
              className="transition-colors hover:text-white"
            >
              FAQs
            </a>
          </nav>
          <div className="pt-4 border-t border-neutral-900">
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 transition-colors"
            >
              Join Club
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
