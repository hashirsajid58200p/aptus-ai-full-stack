import Link from "next/link"
import { ArrowUpRight, Heart, Factory, Code, Truck, Zap, ShoppingBag } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"

const portfolioCompanies = [
  {
    name: "Meridian Healthcare",
    sector: "Healthcare",
    description:
      "Scaled from 3 to 12 states under our partnership. Leading provider of specialized healthcare services.",
    url: "https://meridianhealthcare.com",
    icon: Heart,
  },
  {
    name: "Atlas Industrial",
    sector: "Manufacturing",
    description: "4x revenue growth in 5 years. Precision manufacturing solutions for aerospace and defense.",
    url: "https://atlasindustrial.com",
    icon: Factory,
  },
  {
    name: "Vertex Software",
    sector: "Technology",
    description: "From Series B to market leader. Enterprise SaaS platform powering digital transformation.",
    url: "https://vertexsoftware.io",
    icon: Code,
  },
  {
    name: "Coastal Logistics",
    sector: "Transportation",
    description: "Expanded to 40+ distribution centers. End-to-end supply chain and logistics management.",
    url: "https://coastallogistics.com",
    icon: Truck,
  },
  {
    name: "Pinnacle Energy",
    sector: "Energy",
    description: "2GW capacity under development. Renewable energy infrastructure at scale.",
    url: "https://pinnacle-energy.com",
    icon: Zap,
  },
  {
    name: "Horizon Consumer",
    sector: "Consumer",
    description: "Acquired and integrated 6 brands. Premium portfolio with national distribution.",
    url: "https://horizonconsumer.com",
    icon: ShoppingBag,
  },
]

export function Portfolio() {
  return (
    <section id="portfolio" className="py-28 px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll>
          <div className="mb-16">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6">Proven Results</h2>
            <p className="text-muted-foreground max-w-2xl text-pretty text-lg">
              47 investments. 18 successful exits. See how we've helped exceptional teams build category-defining
              businesses.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioCompanies.map((company, index) => (
            <AnimateOnScroll key={company.name} delay={index * 100}>
              <Link href={company.url} target="_blank" rel="noopener noreferrer">
                <div className="group p-8 h-full border border-border/50 bg-card hover:border-accent/40 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-primary/10 flex items-center justify-center">
                      <company.icon className="w-7 h-7 text-primary" strokeWidth={1} />
                    </div>
                    <ArrowUpRight
                      className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors"
                      strokeWidth={1}
                    />
                  </div>
                  <div className="text-[11px] font-medium text-accent uppercase tracking-widest mb-3">
                    {company.sector}
                  </div>
                  <h3 className="text-xl font-medium mb-3">{company.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
