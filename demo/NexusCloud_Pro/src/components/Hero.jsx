import React from 'react';
import { Cloud, ShieldCheck, Database, Zap, ArrowRight, CheckCircle2, Server } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Background Lighting & Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Enterprise Infrastructure</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            High-Performance Cloud Hosting & <span className="gradient-text">Serverless Tools</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-300 leading-relaxed font-normal">
            NexusCloud Solutions provides enterprise cloud hosting, automated database backups, 
            serverless deployment tools, and 24/7 infrastructure support tailored for modern software engineering teams.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/40 hover:shadow-indigo-500/60"
            >
              Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-200 glass-panel glass-panel-hover rounded-xl transition-all border border-slate-700 hover:border-slate-500"
            >
              View Infrastructure Details
            </a>
          </div>

          {/* Value Highlights */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>99.99% SLA Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Free Automatic SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Daily Automated Backups</span>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup Banner */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-2xl glass-panel p-4 sm:p-6 border border-slate-800 shadow-2xl shadow-indigo-950/50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-400 font-mono ml-2">console.nexuscloud.io/cluster-us-east-1</span>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              Live Cluster Monitoring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0D1322] p-5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>ACTIVE CONTAINERS</span>
                <Server className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">1,420 / 1,500</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full w-[92%]"></div>
              </div>
            </div>

            <div className="bg-[#0D1322] p-5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>AUTOMATED BACKUPS</span>
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">Completed (00:00 UTC)</div>
              <div className="text-xs text-slate-500 mt-2">Geo-redundant 30-day snapshot active</div>
            </div>

            <div className="bg-[#0D1322] p-5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                <span>GLOBAL REGIONS</span>
                <Cloud className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">US, EU, APAC</div>
              <div className="text-xs text-slate-500 mt-2">4 Enterprise Data Center Nodes</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
