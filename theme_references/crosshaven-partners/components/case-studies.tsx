"use client"

import { ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"
import { CountUp } from "./count-up"

const caseStudies = [
  {
    company: "MedTech Solutions",
    sector: "Healthcare",
    region: "Southeast Asia",
    description:
      "Regional healthcare technology platform providing digital diagnostics and telemedicine services across five countries.",
    investment: "Series B Lead",
    metrics: [
      { label: "Revenue Growth", value: "4.2x", icon: TrendingUp },
      { label: "Team Expansion", value: "850+", icon: Users },
      { label: "Exit Multiple", value: "6.8x", icon: DollarSign },
    ],
    outcome: "Successful exit to strategic acquirer in 2024",
  },
  {
    company: "AgriFlow",
    sector: "Agriculture Tech",
    region: "Latin America",
    description: "Supply chain digitization platform connecting smallholder farmers to global commodity markets.",
    investment: "Growth Equity",
    metrics: [
      { label: "Farmers Served", value: "120K+", icon: Users },
      { label: "GMV Growth", value: "8.5x", icon: TrendingUp },
      { label: "MOIC", value: "4.1x", icon: DollarSign },
    ],
    outcome: "Series D financing at $400M valuation",
  },
]

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-[13px] font-medium text-accent tracking-widest uppercase mb-6 block">
                Success Stories
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-normal">Value Creation in Action</h2>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <AnimateOnScroll key={study.company} delay={index * 150}>
              <div className="border border-border bg-card p-8 lg:p-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-[11px] font-medium text-accent tracking-widest uppercase">
                      {study.sector} — {study.region}
                    </span>
                    <h3 className="font-serif text-2xl mt-2">{study.company}</h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground" strokeWidth={1} />
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8">{study.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {study.metrics.map((metric) => (
                    <div key={metric.label} className="text-center p-4 bg-secondary/50">
                      <metric.icon className="w-4 h-4 text-accent mx-auto mb-2" strokeWidth={1} />
                      <div className="font-serif text-2xl text-accent mb-1">
                        <CountUp value={metric.value} />
                      </div>
                      <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  <span className="text-sm text-muted-foreground">{study.outcome}</span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
