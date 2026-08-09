import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAllArticles } from "@/lib/articles"
import { AnimateOnScroll } from "@/components/animate-on-scroll"

export const metadata = {
  title: "Insights | Bridging Markets Capital Partners",
  description: "Market commentary, investment outlooks, and thought leadership from our team.",
}

export default function InsightsPage() {
  const articles = getAllArticles()
  const featuredArticle = articles[0]
  const remainingArticles = articles.slice(1)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateOnScroll>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1} />
              Back to Home
            </Link>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            <span className="text-[13px] font-medium text-accent tracking-widest uppercase mb-6 block">Insights</span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal mb-6 text-balance">
              Our Perspective
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Market commentary, investment outlooks, and thought leadership from our team.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateOnScroll delay={200}>
            <Link href={`/insights/${featuredArticle.slug}`} className="group block">
              <article className="border border-border bg-card p-10 md:p-16 transition-colors duration-300 hover:border-accent/30">
                <span className="text-[11px] font-medium text-accent tracking-widest uppercase mb-6 block">
                  Featured • {featuredArticle.category}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 group-hover:text-accent transition-colors duration-300 leading-tight text-balance">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-3xl">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                    <span>{featuredArticle.author.name}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{featuredArticle.date}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                  <span className="hidden md:flex items-center gap-2 text-sm font-medium text-accent group-hover:underline underline-offset-4">
                    Read Article <ArrowRight className="w-4 h-4" strokeWidth={1} />
                  </span>
                </div>
              </article>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* All Articles Grid */}
      <section className="pb-28 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateOnScroll>
            <h3 className="text-[13px] font-medium text-muted-foreground tracking-widest uppercase mb-10">
              All Articles
            </h3>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map((article, index) => (
              <AnimateOnScroll key={article.slug} delay={index * 100}>
                <Link href={`/insights/${article.slug}`} className="group block h-full">
                  <article className="border border-border bg-card p-8 h-full flex flex-col transition-colors duration-300 hover:border-accent/30">
                    <span className="text-[11px] font-medium text-accent tracking-widest uppercase mb-4">
                      {article.category}
                    </span>
                    <h3 className="font-serif text-xl mb-4 group-hover:text-accent transition-colors duration-300 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
                    <div className="mt-auto pt-6 border-t border-border/50 flex items-center gap-4 text-[12px] text-muted-foreground">
                      <span>{article.date}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span>{article.readTime}</span>
                    </div>
                  </article>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
