"use client";

import { useState } from "react";

const CLASSES = [
  {
    name: "Power HIIT",
    category: "Cardio",
    duration: "45 mins",
    intensity: "High",
    desc: "Intense bursts of high-impact cardio combined with short rest periods to torch calories and build stamina."
  },
  {
    name: "Barbell Hypertrophy",
    category: "Strength",
    duration: "60 mins",
    intensity: "Very High",
    desc: "Focused on compound lifting mechanics to trigger muscular growth, density, and functional posture strength."
  },
  {
    name: "Zen Flow Yoga",
    category: "Recovery",
    duration: "50 mins",
    intensity: "Low",
    desc: "Incorporate deep breathing techniques, physical alignment poses, and myofascial recovery to rebalance your system."
  },
  {
    name: "Championship Boxing",
    category: "Cardio",
    duration: "45 mins",
    intensity: "High",
    desc: "Learn heavy bag strikes, glove combinations, and core evasion patterns in a high-octane aerobic session."
  },
  {
    name: "Olympic Weightlifting",
    category: "Strength",
    duration: "75 mins",
    intensity: "Elite",
    desc: "Master clean & jerk and snatch progressions. Improve explosive speed, coordination, and athletic mobility."
  },
  {
    name: "Active Mobility & Stretch",
    category: "Recovery",
    duration: "30 mins",
    intensity: "Low",
    desc: "Alleviate joints compression, recover tight hamstrings/hips, and accelerate muscle soreness drainage."
  }
];

export default function Classes() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredClasses = activeFilter === "All" 
    ? CLASSES 
    : CLASSES.filter(c => c.category === activeFilter);

  return (
    <section id="classes" className="py-20 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-lime-400">Signature Classes</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Train with intent</h2>
          </div>
          
          {/* Category Filter tabs */}
          <div className="flex flex-wrap gap-2 bg-neutral-900/50 p-1.5 rounded-full border border-neutral-900 max-w-max">
            {["All", "Strength", "Cardio", "Recovery"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-205 ${
                  activeFilter === filter 
                    ? "bg-lime-400/20 text-lime-400 border border-lime-400/20" 
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col justify-between p-6 rounded-2xl border border-neutral-900 bg-neutral-900/10 hover:border-neutral-800 transition-all duration-300 group hover:shadow-lg hover:shadow-lime-950/5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-lime-400 bg-lime-400/10">
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {item.duration}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">{item.name}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs">
                <span className="text-neutral-500">Intensity Level</span>
                <span className="font-bold text-neutral-300 uppercase tracking-wider">{item.intensity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
