"use client"

import { Marquee } from "./marquee"

export function MarqueeSection() {
  return (
    <section className="bg-black text-[#FF4D00] py-20 overflow-hidden -skew-y-2 origin-left">
      <Marquee text="STRATEGY • DESIGN • AI •" direction={1} className="opacity-80" />
      <Marquee text="FUTURE • CREATIVE • CODE •" direction={-1} className="text-white opacity-90" />
    </section>
  )
}
