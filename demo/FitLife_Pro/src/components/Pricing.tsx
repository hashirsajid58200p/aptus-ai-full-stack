"use client";

import { useState } from "react";
import { CheckIcon } from "./Icons";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const prices = {
    basic: isYearly ? 39 : 49,
    pro: isYearly ? 79 : 99,
    elite: isYearly ? 159 : 199
  };

  return (
    <section id="pricing" className="py-20 border-t border-neutral-900 bg-neutral-950/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-lime-400">Membership Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Flexible options for you</h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Choose the level of access that aligns with your active routine. No hidden fees or registration contracts.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-sm font-semibold ${!isYearly ? "text-white" : "text-neutral-500"}`}>Monthly Billing</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 bg-neutral-800 rounded-full p-0.5 transition-colors focus:outline-none relative"
              aria-label="Toggle pricing mode"
            >
              <div className={`w-5 h-5 bg-lime-400 rounded-full shadow-md transform transition-transform duration-205 ${isYearly ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isYearly ? "text-white" : "text-neutral-500"}`}>
              Yearly Billing
              <span className="text-[10px] font-bold text-neutral-950 bg-lime-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Basic tier */}
          <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/10 flex flex-col justify-between hover:border-neutral-800 transition-colors">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Base Access</h3>
                <p className="text-xs text-neutral-400">Core essentials for routine trainers.</p>
              </div>
              <div className="flex items-baseline text-white">
                <span className="text-4xl font-black">${prices.basic}</span>
                <span className="text-sm font-semibold text-neutral-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3.5 text-sm text-neutral-300 pt-4 border-t border-neutral-900">
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Full cardio & weight facilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Locker rooms & shower access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Standard 5AM - 11PM entry</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-500">
                  <CheckIcon className="w-5 h-5 text-neutral-700" />
                  <span>Group classes not included</span>
                </li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-neutral-800 hover:border-neutral-600 hover:bg-white/[0.02] transition-all">
              Get Started
            </button>
          </div>

          {/* Pro tier (Featured) */}
          <div className="p-8 rounded-2xl border-2 border-lime-400 bg-neutral-900/40 flex flex-col justify-between relative shadow-xl shadow-lime-950/5">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-950 bg-lime-400">
              Most Popular
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Pro Athlete</h3>
                <p className="text-xs text-neutral-400">Full access, classes, and wellness perks.</p>
              </div>
              <div className="flex items-baseline text-white">
                <span className="text-4xl font-black">${prices.pro}</span>
                <span className="text-sm font-semibold text-neutral-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3.5 text-sm text-neutral-300 pt-4 border-t border-neutral-900">
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>24/7 keyless mobile app access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Unlimited group classes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Infrared sauna & steam rooms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>1 Trainer orientation session</span>
                </li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 transition-all duration-300 shadow-md shadow-lime-950/20">
              Join Pro Now
            </button>
          </div>

          {/* Elite tier */}
          <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900/10 flex flex-col justify-between hover:border-neutral-800 transition-colors">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Elite Coaching</h3>
                <p className="text-xs text-neutral-400">For those demanding maximum support.</p>
              </div>
              <div className="flex items-baseline text-white">
                <span className="text-4xl font-black">${prices.elite}</span>
                <span className="text-sm font-semibold text-neutral-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3.5 text-sm text-neutral-300 pt-4 border-t border-neutral-900">
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>All Pro Athlete features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>4 Coach training sessions/mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Personal nutrition profile & planner</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Unlimited recovery suite entry</span>
                </li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-neutral-800 hover:border-neutral-600 hover:bg-white/[0.02] transition-all">
              Contact Elite
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
