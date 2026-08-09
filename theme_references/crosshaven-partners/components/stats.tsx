import { DollarSign, Building2, Calendar, TrendingUp } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"
import { CountUp } from "./count-up"

const stats = [
  { value: "$2.8B+", label: "Capital Deployed", icon: DollarSign },
  { value: "47", label: "Companies Transformed", icon: Building2 },
  { value: "18", label: "Years Delivering Returns", icon: Calendar },
  { value: "3.2x", label: "Avg. Return to Investors", icon: TrendingUp },
]

export function Stats() {
  return (
    <section className="py-20 px-6 lg:px-8 border-y border-border/50">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, index) => (
            <AnimateOnScroll key={index} delay={index * 100}>
              <div className={`text-center ${index > 0 ? "md:border-l md:border-border/50" : ""}`}>
                <stat.icon className="w-5 h-5 text-accent mx-auto mb-4" strokeWidth={1} />
                <div className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-3 tracking-tight">
                  <CountUp value={stat.value} duration={2000} />
                </div>
                <div className="text-[13px] text-muted-foreground tracking-wide uppercase font-medium">
                  {stat.label}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
