import React from 'react';
import { Cloud, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070A12] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">NexusCloud Solutions</span>
          </div>

          <p className="text-slate-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} NexusCloud Solutions Inc. All rights reserved. Powered by Aptus AI Chatbot.
          </p>

          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Documentation</a>
            <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing SLA</a>
            <a href="#support" className="hover:text-indigo-400 transition-colors">System Status</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
