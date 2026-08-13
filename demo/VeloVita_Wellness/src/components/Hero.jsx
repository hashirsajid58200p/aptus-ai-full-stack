import React from 'react';
import { Sparkles, Activity, Clock, Shield, Calendar, ArrowRight, HeartPulse, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#F7F4EC] via-[#FFFDF9] to-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Premier Wellness Sanctuary</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Reinvent Your Body & <br />
              <span className="heading-gradient">Mind Recovery</span>
            </h1>

            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
              VeloVita Wellness Hub offers personalized workout routines, custom nutrition planning, 
              infrared sauna & cryo recovery suites, and 24/7 keyless mobile access.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <a
                href="#memberships"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-bold text-white bg-terracotta-600 hover:bg-terracotta-700 rounded-xl transition-all shadow-lg shadow-orange-600/20"
              >
                Claim 3-Day Guest Pass <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-stone-800 bg-white hover:bg-stone-50 rounded-xl transition-all border border-stone-300 shadow-sm"
              >
                Explore Services
              </a>
            </div>

            <div className="pt-4 flex items-center space-x-6 text-xs sm:text-sm text-stone-600 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24/7 Keyless Entry</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Custom Nutrition</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sauna & Cryo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Schedule & Recovery Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="wellness-card p-6 border border-stone-200 space-y-6">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Today's Sanctuary Schedule</h3>
                    <p className="text-xs text-stone-500 font-medium">100 Fitness Boulevard, NY</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Open 24/7
                </span>
              </div>

              {/* Today's Schedule Items */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-stone-900">07:00 AM</span>
                    <span className="font-medium text-stone-700">Power HIIT & Hypertrophy</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Studio A</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-stone-900">12:30 PM</span>
                    <span className="font-medium text-stone-700">Infrared Sauna Session</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold">Spa Suite 2</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-stone-900">06:00 PM</span>
                    <span className="font-medium text-stone-700">Zen Flow Yoga & Stretch</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Mind Studio</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span className="flex items-center"><Activity className="w-3.5 h-3.5 text-orange-600 mr-1" /> 1-on-1 Coaching</span>
                <span className="flex items-center"><HeartPulse className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Cryo Spa Active</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
