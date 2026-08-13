import React from 'react';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small projects, staging environments, and early-stage SaaS apps.',
    features: [
      '2 vCPU & 4GB Dedicated RAM',
      '80GB NVMe SSD Storage',
      'Daily Automated Backups (7-day retention)',
      'Free Automated SSL Certificate',
      'Standard Ticket Support',
      'US-East & US-West Deployment'
    ],
    highlighted: false,
    cta: 'Deploy Starter'
  },
  {
    name: 'Professional',
    price: '$149',
    period: '/month',
    description: 'Ideal for scaling production applications requiring 99.99% high availability.',
    features: [
      '8 vCPU & 16GB High-Speed RAM',
      '250GB Enterprise NVMe Storage',
      'Daily Backups (30-day geo-redundant)',
      'Serverless Auto-scaling Rules',
      '24/7 Priority Live Chat Support',
      'All Global Data Center Regions'
    ],
    highlighted: true,
    cta: 'Start Pro Trial'
  },
  {
    name: 'Enterprise',
    price: '$499',
    period: '/month',
    description: 'Custom infrastructure solution built for high-throughput enterprise workloads.',
    features: [
      'Dedicated Bare-Metal Compute Nodes',
      '1TB+ High-IOPS NVMe Array',
      'Continuous Real-Time Replication',
      'Custom SLA & Dedicated Account Engineer',
      '24/7 Phone & Incident Support',
      'Multi-Cloud Hybrid Direct Connect'
    ],
    highlighted: false,
    cta: 'Contact Sales'
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 relative bg-[#090D16] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Flexible Hosting Tiers</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Pricing Built for Scaling
          </p>
          <p className="text-slate-400 mt-4 text-base">
            Upgrade or downgrade your cloud tier anytime directly from your dashboard billing tab.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlighted
                  ? 'glass-panel border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 scale-105 z-10'
                  : 'glass-panel border border-slate-800'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase px-4 py-1 rounded-full tracking-wider shadow-md">
                  Most Popular for Production
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  <span className="text-slate-400 text-sm font-medium ml-1">{plan.period}</span>
                </div>

                <div className="border-t border-slate-800/80 pt-6 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-4">Included Specifications:</span>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start text-sm text-slate-300">
                        <Check className="w-4 h-4 text-indigo-400 mr-2.5 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
