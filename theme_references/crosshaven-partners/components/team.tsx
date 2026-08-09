import { ArrowRight } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"
import Image from "next/image"

const team = [
  {
    name: "Allan Bradford",
    role: "Founding Partner",
    bio: "Former KKR. Led $5B+ in transactions across technology and healthcare.",
    image: "/images/allan-bradford-founding-20partner-compressed.webp",
  },
  {
    name: "Christopher Jordan",
    role: "Partner",
    bio: "Former Goldman Sachs Principal. Deep expertise in industrial growth equity.",
    image: "/images/christopher-20jordan-partner-compressed.webp",
  },
  {
    name: "Juliette Knowles",
    role: "SVP Investments",
    bio: "Ex-McKinsey Partner. Driven 40%+ margin improvement across portfolio.",
    image: "/images/juliette-20knowles-svp-20investments-compressed.webp",
  },
]

export function Team() {
  return (
    <section id="team" className="py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-6">Your Partners</h2>
              <p className="text-muted-foreground max-w-xl text-lg">
                Senior operators and investors who've been in your seat. We bring pattern recognition from 47
                investments to every partnership.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 text-[13px] font-medium tracking-wide uppercase text-accent hover:gap-4 transition-all"
            >
              Start a Conversation <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </AnimateOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <AnimateOnScroll key={member.name} delay={index * 150}>
              <div className="group cursor-pointer">
                <div className="aspect-[4/5] bg-secondary mb-6 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={500}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 grayscale hover:grayscale-0 saturate-[0.3] hover:saturate-100"
                  />
                </div>
                <h3 className="font-medium text-xl mb-1">{member.name}</h3>
                <p className="text-[13px] text-accent uppercase tracking-wide mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
