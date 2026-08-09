"use client"

import { Compass, Shield, Zap } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"

const principles = [
  {
    icon: Compass,
    title: "Market Selection",
    description:
      "We focus on economies with structural tailwinds—rising middle class, favorable demographics, and increasing consumption.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Rigorous due diligence, conservative leverage, and active portfolio monitoring protect capital through market cycles.",
  },
  {
    icon: Zap,
    title: "Value Creation",
    description:
      "We partner with management to professionalize operations, expand margins, and unlock strategic growth opportunities.",
  },
]

export function InvestmentThesis() {
  return (
    <section id="thesis" className="py-28 px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll>
          <div className="max-w-3xl mb-20">
            <span className="text-[13px] font-medium text-accent tracking-widest uppercase mb-6 block">
              Investment Philosophy
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-8">
              Disciplined Conviction in High-Growth Markets
            </h2>
            <p className="text-lg text-primary-foreground/70 leading-relaxed">
              We believe the greatest returns are generated at the intersection of macroeconomic tailwinds and
              exceptional management teams. Our approach combines deep local insight with global best practices to
              identify and nurture tomorrow's market leaders.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <AnimateOnScroll key={principle.title} delay={index * 200} direction="left">
              <div className="border-t border-primary-foreground/20 pt-8">
                <principle.icon className="w-6 h-6 text-accent mb-6" strokeWidth={1} />
                <h3 className="font-medium text-xl mb-4">{principle.title}</h3>
                <p className="text-primary-foreground/70 leading-relaxed">{principle.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
