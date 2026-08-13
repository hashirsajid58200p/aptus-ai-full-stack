import { ClockIcon, DumbbellIcon, HeartIcon, ShieldCheckIcon } from "./Icons";

const FEATURES = [
  {
    icon: <ShieldCheckIcon />,
    title: "Elite Personal Trainers",
    desc: "Work 1-on-1 with certified specialists who design personalized fitness roadmaps based on your anatomy and specific goals."
  },
  {
    icon: <DumbbellIcon />,
    title: "State-of-the-Art Gear",
    desc: "Train with top-of-the-line Biostrength® selectors, hammer strength machines, and premium free weight compounds."
  },
  {
    icon: <ClockIcon />,
    title: "24/7 Smart Gym Access",
    desc: "Fit training into your busy schedule. Lock and unlock the gym via our secure mobile app anytime, day or night."
  },
  {
    icon: <HeartIcon />,
    title: "Nutrition & Recovery Spa",
    desc: "Maximize results at our wellness hub. Equipped with cryotherapy chambers, infrared saunas, and custom diet coaches."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 border-t border-neutral-900 bg-neutral-950/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-lime-400">Premium Standards</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Designed for performance</h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Enjoy amenities that amplify your workouts, help you recover faster, and offer seamless accessibility.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((item, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl border border-neutral-900 bg-neutral-900/20 hover:bg-neutral-900/40 hover:border-neutral-800 transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-6 group-hover:bg-lime-400 group-hover:text-neutral-950 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
