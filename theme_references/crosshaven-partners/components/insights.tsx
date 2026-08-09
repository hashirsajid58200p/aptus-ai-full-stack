"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"

const articles = [
  {
    slug: "southeast-asia-digital-economy",
    category: "Market Commentary",
    title: "Southeast Asia's Digital Economy: A $300B Opportunity",
    date: "December 2025",
    readTime: "8 min read",
  },
  {
    slug: "latin-american-fintech",
    category: "Investment Outlook",
    title: "Why We're Bullish on Latin American Fintech",
    date: "November 2025",
    readTime: "6 min read",
  },
  {
    slug: "measuring-impact-beyond-metrics",
    category: "ESG Insights",
    title: "Measuring Impact: Beyond Traditional Metrics",
    date: "October 2025",
    readTime: "5 min read",
  },
]

export function Insights() {
  return (
    <section id="insights" className="py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-[13px] font-medium text-accent tracking-widest uppercase mb-6 block">Insights</span>
              <h2 className="font-serif text-4xl md:text-5xl font-normal">Our Perspective</h2>
            </div>
            <Link
              href="/insights"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-accent hover:underline underline-offset-4"
            >
              View All <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </Link>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <AnimateOnScroll key={article.title} delay={index * 150}>
              <Link href={`/insights/${article.slug}`} className="group block h-full">
                <article className="border border-border bg-card p-8 h-full flex flex-col transition-colors duration-300 hover:border-accent/30">
                  <span className="text-[11px] font-medium text-accent tracking-widest uppercase mb-4">
                    {article.category}
                  </span>
                  <h3 className="font-serif text-xl mb-4 group-hover:text-accent transition-colors duration-300 leading-snug">
                    {article.title}
                  </h3>
                  <div className="mt-auto pt-6 flex items-center gap-4 text-[12px] text-muted-foreground">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{article.readTime}</span>
                  </div>
                </article>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={500}>
          <div className="mt-8 md:hidden">
            <Link
              href="/insights"
              className="flex items-center gap-2 text-sm font-medium text-accent hover:underline underline-offset-4"
            >
              View All Insights <ArrowRight className="w-4 h-4" strokeWidth={1} />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
