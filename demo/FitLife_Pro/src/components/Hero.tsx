import Image from "next/image";
import { DumbbellIcon } from "./Icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:py-32">
      {/* Accent Glow Background */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-lime-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-[140px]" />
      
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="md:col-span-7 space-y-6 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-lime-400 bg-lime-950/20 border border-lime-500/20 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-ping" />
            Premium fitness destination
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-tight">
            Redefine Your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-emerald-500">
              Physical limits
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto md:mx-0">
            FitLife Pro is an elite fitness sanctuary designed to push boundaries. Train on cutting-edge equipment, access luxury recovery suites, and work with world-class coaches.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <a 
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-lime-500/10"
            >
              Start Free Pass
            </a>
            <a 
              href="#classes"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider text-white border border-neutral-800 hover:border-neutral-600 hover:bg-white/[0.02] transition-colors"
            >
              Explore Classes
            </a>
          </div>

          {/* Quick stats panel */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-900 max-w-md mx-auto md:mx-0 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">15k+</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">Members</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">50+</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">Pro Coaches</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">24/7</div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider mt-0.5">Availability</div>
            </div>
          </div>
        </div>

        {/* Right Media representation */}
        <div className="md:col-span-5 relative w-full h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-neutral-900 group">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />
          <Image 
            src="/gym_hero.png" 
            alt="FitLife Pro Gym Luxury Interior"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay Interactive Badge */}
          <div className="absolute bottom-6 left-6 z-25 bg-neutral-900/90 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-400">
              <DumbbellIcon />
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium">Next Group Class</p>
              <p className="text-sm font-bold text-white">Power HIIT at 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
