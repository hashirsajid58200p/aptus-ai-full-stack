const TESTIMONIALS = [
  {
    quote: "FitLife Pro completely reshaped my view of fitness. The trainers are highly educated, and the equipment is outstanding. The 24/7 keyless entry is a game-changer for my hectic schedule.",
    author: "Alexander K.",
    role: "Member since 2024",
    initials: "AK"
  },
  {
    quote: "The clean atmosphere, the infrared sauna recovery, and the community energy make this gym unique. Worth every single dollar of the monthly fee. Highly recommended!",
    author: "Samantha R.",
    role: "Member since 2025",
    initials: "SR"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-lime-400">Success Stories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Approved by our athletes</h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Read testimonials from dedicated members who have radically transformed their physical composition and energy limits at FitLife Pro.
            </p>
          </div>
          
          <div className="md:col-span-7 grid gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/10 flex flex-col justify-between">
                <p className="text-neutral-300 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-neutral-950 font-bold flex items-center justify-center text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.author}</h4>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
