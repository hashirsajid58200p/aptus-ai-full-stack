"use client"

import { Leaf, Users, Building, Globe } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"

const commitments = [
  {
    icon: Leaf,
    title: "Environmental",
    description: "Carbon footprint assessment and reduction targets across portfolio companies.",
  },
  {
    icon: Users,
    title: "Social",
    description: "Fair labor practices, diversity initiatives, and community engagement programs.",
  },
  {
    icon: Building,
    title: "Governance",
    description: "Independent boards, transparent reporting, and ethical business practices.",
  },
  {
    icon: Globe,
    title: "Impact",
    description: "Measurable outcomes aligned with UN Sustainable Development Goals.",
  },
]

export function ESG() {
  return (
    <section id="esg" className="py-28 px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <AnimateOnScroll>
            <div>
              <span className="text-[13px] font-medium text-accent tracking-widest uppercase mb-6 block">
                Responsible Investing
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-normal leading-tight mb-8">Returns With Purpose</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We believe sustainable practices and superior returns are mutually reinforcing. Our ESG framework is
                integrated into every stage of the investment lifecycle—from due diligence to value creation to exit.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As signatories to the UN Principles for Responsible Investment, we hold ourselves and our portfolio
                companies to the highest standards of environmental stewardship, social responsibility, and corporate
                governance.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid sm:grid-cols-2 gap-6">
            {commitments.map((commitment, index) => (
              <AnimateOnScroll key={commitment.title} delay={index * 100}>
                <div className="p-6 bg-card border border-border">
                  <commitment.icon className="w-5 h-5 text-accent mb-4" strokeWidth={1} />
                  <h3 className="font-medium mb-2">{commitment.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{commitment.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
