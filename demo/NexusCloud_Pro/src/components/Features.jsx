import React from 'react';
import { Server, Database, ShieldCheck, Cpu, Headphones, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Server,
    title: 'Enterprise Cloud Hosting',
    description: 'High-speed cloud server infrastructure with dedicated compute nodes, scalable bandwidth, and isolated tenant environments.',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10'
  },
  {
    icon: Database,
    title: 'Automated DB Backups',
    description: 'Daily automated database snapshots executed at midnight UTC, safely stored in geo-redundant storage with 30-day retention.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10'
  },
  {
    icon: Cpu,
    title: 'Serverless Deployment Tools',
    description: 'Deploy code instantly from GitHub repos with auto-scaling microservices, custom domain routing, and zero zero-downtime rollouts.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'Automatic SSL Provisioning',
    description: 'Free, automated TLS/SSL certificates provisioned instantly for all connected custom domains and subdomains.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  {
    icon: Headphones,
    title: '24/7 Technical Support',
    description: 'Direct priority ticket and live chat support backed by senior DevOps engineers on our Professional and Enterprise plans.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10'
  },
  {
    icon: RefreshCw,
    title: 'Automated Migration Suite',
    description: 'Free automated server migration tools to seamlessly transfer legacy workloads onto NexusCloud without downtime.',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 relative border-t border-slate-800/80 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Infrastructure Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Unmatched Reliability & Scale
          </p>
          <p className="text-slate-400 mt-4 text-base">
            Everything your team needs to host, back up, scale, and maintain mission-critical applications.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
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
