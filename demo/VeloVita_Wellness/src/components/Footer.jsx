import React from 'react';
import { Activity, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-stone-200">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">VeloVita Wellness Hub</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              An elite training & recovery sanctuary pushing physical boundaries and maximizing athletic performance.
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="font-bold text-slate-900 text-base mb-2">Location & Contact</div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100 Fitness Boulevard, Suite A, New York, NY</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Facility Hours: Open 24/7/365</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="font-bold text-slate-900 text-base mb-2">Quick Navigation</div>
            <div className="flex flex-col space-y-1">
              <a href="#services" className="hover:text-emerald-600 transition-colors">Personal Training & Classes</a>
              <a href="#memberships" className="hover:text-emerald-600 transition-colors">Pro & Elite Memberships</a>
              <a href="#services" className="hover:text-emerald-600 transition-colors">Cryotherapy & Sauna Spa</a>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VeloVita Wellness Hub Inc. All rights reserved.</p>
          <p>Powered by Aptus AI Chatbot Widget.</p>
        </div>
      </div>
    </footer>
  );
}
