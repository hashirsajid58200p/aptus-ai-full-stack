"use client";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-12">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <span className="text-xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
            FITLIFE PRO
          </span>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Premium physical training environments dedicated to boosting human athletic performance.
          </p>
        </div>
        
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Location & Hours</h4>
          <ul className="text-xs text-neutral-400 space-y-2.5">
            <li>100 Fitness Boulevard, Suite A</li>
            <li>New York, NY 10001</li>
            <li className="pt-2 text-lime-400">Open 24 Hours / 7 Days a week</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
          <ul className="text-xs text-neutral-400 space-y-2.5">
            <li><a href="#features" className="hover:text-white">Benefits</a></li>
            <li><a href="#classes" className="hover:text-white">Classes</a></li>
            <li><a href="#pricing" className="hover:text-white">Memberships</a></li>
            <li><a href="#faqs" className="hover:text-white">Support FAQs</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Get Gym News</h4>
          <p className="text-xs text-neutral-500">Subscribe for free trial offers and class updates.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter email"
              className="bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-lime-400 w-full"
              required
            />
            <button 
              type="submit"
              className="px-4 py-2 rounded-full text-xs font-semibold uppercase bg-lime-400 text-neutral-950 hover:bg-lime-300 transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-neutral-600">&copy; {new Date().getFullYear()} FitLife Pro. All rights reserved. Powered by Aptus AI Chatbot.</p>
        <div className="flex gap-4 text-[10px] text-neutral-600">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
