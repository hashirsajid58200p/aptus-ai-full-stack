import React from 'react';
import { Cloud, Server, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
              <Cloud className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              NexusCloud <span className="text-indigo-400 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">PRO</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Enterprise Cloud Infrastructure</span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
            Services & Infrastructure
          </a>
          <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
            Hosting Plans
          </a>
          <a href="#backup" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
            Automated Backups
          </a>
          <a href="#support" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
            24/7 Support
          </a>
        </nav>

        {/* Live Status & CTA */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Nodes Operational (99.99%)</span>
          </div>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/50"
          >
            Deploy Console <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </header>
  );
}
