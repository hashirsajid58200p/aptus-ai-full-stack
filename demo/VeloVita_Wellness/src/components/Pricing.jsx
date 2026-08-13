import React from 'react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Standard Access',
    price: '$49',
    period: '/month',
    description: 'Essential gym membership for independent training and fitness goals.',
    features: [
      '24/7 Keyless Mobile App Access',
      'Full Strength & Cardio Equipment',
      '1 Complimentary Fitness Assessment',
      'Digital Lockers & Luxury Showers',
      'Free Garage Parking'
    ],
    highlighted: false,
    cta: 'Select Standard'
  },
  {
    name: 'Pro Athlete Tier',
    price: '$99',
    period: '/month',
    description: 'Comprehensive membership with group fitness classes & recovery spa access.',
    features: [
      'Everything in Standard Tier',
      'Unlimited Group Fitness Classes',
      'Infrared Sauna & Steam Room Access',
      'Fresh Towel & Vanity Service',
      '1 Trainer Orientation Session',
      'Free Membership Freeze (up to 60 days)'
    ],
    highlighted: true,
    cta: 'Start Pro Membership'
  },
  {
    name: 'Elite Coaching Tier',
    price: '$199',
    period: '/month',
    description: 'All-inclusive VIP membership with dedicated 1-on-1 coaching & custom nutrition.',
    features: [
      'Everything in Pro Athlete Tier',
      'Personalized Nutrition & Meal Plans',
      'Cryotherapy Chamber Access',
      'Dedicated 1-on-1 Personal Trainer',
      'Monthly InBody Body Composition Scans',
      'Priority Class & Spa Reservations'
    ],
    highlighted: false,
    cta: 'Join Elite Coaching'
  }
];

export default function Pricing() {
  return (
    <section id="memberships" className="py-20 relative bg-[#F6F8F6] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">Membership Tiers</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Membership Options
          </p>
          <p className="text-slate-600 mt-4 text-base">
            No hidden contracts or cancellation fees. Freeze or cancel anytime with 15-day notice.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.highlighted
                  ? 'bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-600/15 scale-105 z-10'
                  : 'bg-white border border-stone-200 shadow-md'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold uppercase px-4 py-1 rounded-full tracking-wider shadow-sm">
                  Most Popular Membership
                </div>
              )}

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-slate-600 text-sm mb-6 min-h-[40px]">{tier.description}</p>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{tier.price}</span>
                  <span className="text-slate-500 text-sm font-medium ml-1">{tier.period}</span>
                </div>

                <div className="border-t border-stone-200 pt-6 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-4">What's Included:</span>
                  <ul className="space-y-3">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 mr-2.5 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all ${
                  tier.highlighted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
