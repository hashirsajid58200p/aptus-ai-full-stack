import React from 'react';
import { Dumbbell, Utensils, Flame, Calendar, Key, Shield } from 'lucide-react';

const services = [
  {
    icon: Dumbbell,
    title: 'Personalized Workout Routines',
    description: '1-on-1 athletic strength & conditioning programs built by certified elite personal trainers to reach your specific fitness objectives.',
    tag: 'Athletic Coaching'
  },
  {
    icon: Utensils,
    title: 'Custom Nutrition & Meal Planning',
    description: 'Targeted dietary planning and macronutrient coaching tailored to your lifestyle, body composition, and metabolic profile.',
    tag: 'Nutrition Suite'
  },
  {
    icon: Flame,
    title: 'Infrared Sauna & Cryo Recovery Spa',
    description: 'Full access to state-of-the-art cryotherapy chambers, infrared saunas, steam rooms, and compression recovery suites.',
    tag: 'Spa & Recovery'
  },
  {
    icon: Calendar,
    title: 'Live & On-Demand Group Classes',
    description: 'Over 100 signature group classes monthly including Power HIIT, Barbell Hypertrophy, Zen Flow Yoga, and Championship Boxing.',
    tag: '100+ Classes/mo'
  },
  {
    icon: Key,
    title: '24/7 Keyless Mobile App Entry',
    description: 'Unlock facility doors instantly anytime using your encrypted mobile key on your iOS or Android smartphone.',
    tag: 'Keyless Mobile Entry'
  },
  {
    icon: Shield,
    title: 'Executive Locker Rooms & Amenities',
    description: 'Executive locker rooms fully stocked with private showers, digital lockers, fresh towel service, and premium vanity products.',
    tag: 'Luxury Amenities'
  }
];

export default function Features() {
  return (
    <section id="services" className="py-20 relative bg-[#FFFDF9] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-left max-w-3xl mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-terracotta-600 mb-3">Sanctuary Offerings</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Designed for Complete Athletic & Wellness Excellence
          </p>
        </div>

        {/* 2-Column Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="wellness-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-terracotta-600" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
