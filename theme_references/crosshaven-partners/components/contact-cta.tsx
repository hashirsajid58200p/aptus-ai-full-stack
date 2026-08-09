"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimateOnScroll } from "./animate-on-scroll"

export function ContactCTA() {
  return (
    <section className="py-28 px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl text-center">
        <AnimateOnScroll>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-8">
            Let's Build Something Exceptional Together
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150}>
          <p className="text-lg text-primary-foreground/70 leading-relaxed mb-12 max-w-2xl mx-auto">
            Whether you're an entrepreneur seeking growth capital, an institutional investor exploring emerging markets,
            or an advisor with a compelling opportunity—we'd like to hear from you.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
              Start a Conversation <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 bg-transparent"
            >
              Download Investor Materials
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
