"use client"

import { Star } from "lucide-react"
import { ServiceCard } from "./service-card"

const services = [
  { title: "AI Strategy", tags: ["Consulting", "Implementation", "LLM Integration"] },
  { title: "Interface", tags: ["UI/UX Design", "Design Systems", "Prototyping"] },
  { title: "Development", tags: ["React", "TypeScript", "Next.js", "WebGL"] },
  { title: "Branding", tags: ["Identity", "Motion", "3D Visuals"] },
]

export function Services() {
  return (
    <section className="bg-black min-h-screen py-32 relative">
      <div className="container mx-auto px-4 mb-20 flex items-end justify-between">
        <h2 className="font-serif text-[12vw] leading-none text-white uppercase font-black">Services</h2>
        <Star className="w-24 h-24 text-[#FF4D00] animate-pulse hidden md:block" fill="currentColor" />
      </div>

      <div className="flex flex-col">
        {services.map((s, i) => (
          <ServiceCard key={i} number={`0${i + 1}`} title={s.title} tags={s.tags} />
        ))}
      </div>
    </section>
  )
}
