import React from 'react';
import { Activity, ShieldCheck, Key, ChevronRight } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full light-glass border-b border-stone-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              VeloVita <span className="text-emerald-700 text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">WELLNESS</span>
            </span>
            <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Elite Fitness & Recovery Sanctuary</span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
            Wellness Services
          </a>
          <a href="#memberships" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
            Membership Plans
          </a>
          <a href="#coaching" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
            Nutrition & Coaching
          </a>
          <a href="#amenities" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
            Spa & Recovery
          </a>
        </nav>

        {/* Live Facility Badge & CTA */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-semibold">
            <Key className="w-3.5 h-3.5 text-emerald-600" />
            <span>24/7 Keyless Mobile Access Active</span>
          </div>
          <a
            href="#memberships"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-md shadow-emerald-600/20"
          >
            Claim 3-Day Pass <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

      </div>
    </header>
  );
}
