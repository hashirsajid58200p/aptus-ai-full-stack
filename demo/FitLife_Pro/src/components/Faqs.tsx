"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Can I try out the gym before purchasing a membership?",
    a: "Absolutely! We offer a complimentary 3-day guest pass for local residents. You can sign up using the button in the Hero section or message our automated chat assistant in the corner."
  },
  {
    q: "What recovery features are included in the Pro tier?",
    a: "The Pro tier includes unlimited access to our active recovery classes, steam rooms, saunas, and 2 sessions per month in our compression therapy suites."
  },
  {
    q: "How do I book sessions with a personal trainer?",
    a: "You can book sessions directly inside our mobile member app, at the front desk, or request a booking through our digital chat assistant right on this page."
  }
];

export default function Faqs() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <section id="faqs" className="py-20 border-t border-neutral-900 bg-neutral-950/40">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-lime-400">Common Questions</span>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight">Frequently Asked</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-neutral-900 rounded-xl bg-neutral-900/10 overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-white text-sm sm:text-base">{faq.q}</span>
                  <span className={`text-lime-400 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-neutral-400 leading-relaxed border-t border-neutral-900/50 pt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
