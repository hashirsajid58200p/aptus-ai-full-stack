"use client"

import { AnimateOnScroll } from "./animate-on-scroll"

const partnerTypes = [
  "Sovereign Wealth Funds",
  "Public Pension Plans",
  "University Endowments",
  "Family Offices",
  "Insurance Companies",
  "Fund of Funds",
]

export function TrustedBy() {
  return (
    <section className="py-20 px-6 lg:px-8 border-y border-border">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll>
          <p className="text-[13px] font-medium text-muted-foreground tracking-widest uppercase text-center mb-12">
            Capital Partners
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partnerTypes.map((partner, index) => (
            <AnimateOnScroll key={partner} delay={index * 100}>
              <div className="text-center">
                <span className="text-sm font-medium text-muted-foreground">{partner}</span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
