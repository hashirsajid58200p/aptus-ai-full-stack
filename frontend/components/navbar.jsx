"use client";
import React, { useState } from "react";
import { Button } from "components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { loading, user } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-3 border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/aptus-logo.png"
              alt="Aptus"
              width={160}
              height={48}
              className="h-12 w-auto object-contain hover:scale-105 transition-transform"
              priority
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8">
            <a
              href="#how-it-works"
              className="text-[#1a1a1a] hover:text-[#FF4D00] inline-flex items-center px-1 pt-1 text-sm font-extrabold uppercase tracking-wider transition-colors"
            >
              HOW IT WORKS
            </a>
            <a
              href="#features"
              className="text-[#1a1a1a] hover:text-[#FF4D00] inline-flex items-center px-1 pt-1 text-sm font-extrabold uppercase tracking-wider transition-colors"
            >
              FEATURES
            </a>
            <a
              href="#action-preview"
              className="text-[#1a1a1a] hover:text-[#FF4D00] inline-flex items-center px-1 pt-1 text-sm font-extrabold uppercase tracking-wider transition-colors"
            >
              IN ACTION
            </a>
            <a
              href="#faq"
              className="text-[#1a1a1a] hover:text-[#FF4D00] inline-flex items-center px-1 pt-1 text-sm font-extrabold uppercase tracking-wider transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex sm:items-center gap-3">
            {loading ? (
              <div className="w-28 h-10 border-2 border-[#1a1a1a] bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <Button
                onClick={() => router.push("/user")}
                className="btn-neo px-6 py-2 rounded-none"
              >
                DASHBOARD
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/start")}
                className="btn-neo-primary px-6 py-2 rounded-none"
              >
                GET TOKEN
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-[#1a1a1a] border-2 border-[#1a1a1a] bg-[#BFF000] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden border-t-3 border-[#1a1a1a] bg-[#FDF9F0] py-4 px-2 space-y-3">
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-base font-extrabold uppercase text-[#1a1a1a] hover:bg-[#BFF000] border-2 border-transparent hover:border-[#1a1a1a]"
            >
              HOW IT WORKS
            </a>
            <a
              href="#features"
              className="block px-3 py-2 text-base font-extrabold uppercase text-[#1a1a1a] hover:bg-[#BFF000] border-2 border-transparent hover:border-[#1a1a1a]"
            >
              FEATURES
            </a>
            <a
              href="#action-preview"
              className="block px-3 py-2 text-base font-extrabold uppercase text-[#1a1a1a] hover:bg-[#BFF000] border-2 border-transparent hover:border-[#1a1a1a]"
            >
              IN ACTION
            </a>
            <a
              href="#faq"
              className="block px-3 py-2 text-base font-extrabold uppercase text-[#1a1a1a] hover:bg-[#BFF000] border-2 border-transparent hover:border-[#1a1a1a]"
            >
              FAQ
            </a>

            <div className="pt-2">
              {loading ? (
                <div className="w-full h-10 border-2 border-[#1a1a1a] bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <Button
                  onClick={() => router.push("/user")}
                  className="w-full btn-neo py-3 rounded-none"
                >
                  DASHBOARD
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/start")}
                  className="w-full btn-neo-primary py-3 rounded-none"
                >
                  GET TOKEN
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
