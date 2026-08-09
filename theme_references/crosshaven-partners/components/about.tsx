import { ArrowRight, Target, TrendingUp } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"

const pillars = [
  {
    number: "01",
    title: "Operational Excellence",
    description:
      "Our hands-on approach delivers measurable results—optimizing margins, accelerating revenue, and positioning your business for long-term success.",
    icon: Target,
  },
  {
    number: "02",
    title: "Strategic Capital",
    description:
      "Flexible capital structures tailored to your goals. From growth equity to buyouts, we structure deals that align incentives and maximize value creation.",
    icon: TrendingUp,
  },
]

export function About() {
  return (
    <section id="about" className="py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <AnimateOnScroll>
            <div>
              <span className="text-[13px] font-medium text-accent tracking-widest uppercase mb-6 inline-flex items-center gap-3">
                Why Partner With Us <ArrowRight className="w-3 h-3" strokeWidth={1} />
              </span>
              <p className="text-2xl md:text-3xl leading-relaxed text-pretty font-light">
                We don't just invest—we build. Our team brings operational expertise, deep sector knowledge, and a
                network of industry relationships to help you achieve outcomes that matter.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150}>
            <div>
              <p className="text-[13px] font-medium text-muted-foreground tracking-widest uppercase mb-8">
                Our Investment Pillars
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {pillars.map((pillar, index) => (
                  <AnimateOnScroll key={pillar.number} delay={300 + index * 150}>
                    <div className="p-8 border border-border/50 bg-card hover:border-accent/30 transition-colors duration-300 h-full">
                      <pillar.icon className="w-6 h-6 text-accent mb-4" strokeWidth={1} />
                      <div className="text-5xl font-serif font-normal mb-6 text-accent/60">{pillar.number}</div>
                      <h3 className="font-medium text-lg mb-3">{pillar.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
