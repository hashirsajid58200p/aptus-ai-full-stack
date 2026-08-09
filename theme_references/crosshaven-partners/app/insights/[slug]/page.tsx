import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getArticleBySlug, getAllArticles } from "@/lib/articles"
import { AnimateOnScroll } from "@/components/animate-on-scroll"

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return { title: "Article Not Found" }
  }

  return {
    title: `${article.title} | Bridging Markets`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const allArticles = getAllArticles()
  const currentIndex = allArticles.findIndex((a) => a.slug === slug)
  const nextArticle = allArticles[currentIndex + 1] || allArticles[0]
  const prevArticle = allArticles[currentIndex - 1] || allArticles[allArticles.length - 1]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <article className="pt-32 pb-20 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1} />
              All Insights
            </Link>
          </AnimateOnScroll>

          <header className="mb-16">
            <AnimateOnScroll delay={100}>
              <span className="text-[13px] font-medium text-accent tracking-widest uppercase mb-6 block">
                {article.category}
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-8 leading-tight text-balance">
                {article.title}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground pb-10 border-b border-border">
                <span className="font-medium text-foreground">{article.author.name}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{article.author.role}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{article.date}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{article.readTime}</span>
              </div>
            </AnimateOnScroll>
          </header>

          <AnimateOnScroll delay={400}>
            <div className="prose prose-lg max-w-none">
              {article.content.map((paragraph, index) => (
                <p key={index} className="text-foreground/80 leading-relaxed mb-6 text-[17px]">
                  {paragraph}
                </p>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Article Navigation */}
          <AnimateOnScroll delay={500}>
            <nav className="mt-20 pt-10 border-t border-border">
              <div className="grid md:grid-cols-2 gap-8">
                <Link
                  href={`/insights/${prevArticle.slug}`}
                  className="group p-6 border border-border hover:border-accent/30 transition-colors"
                >
                  <span className="text-[11px] font-medium text-muted-foreground tracking-widest uppercase mb-3 flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3" strokeWidth={1} />
                    Previous
                  </span>
                  <h4 className="font-serif text-lg group-hover:text-accent transition-colors leading-snug">
                    {prevArticle.title}
                  </h4>
                </Link>

                <Link
                  href={`/insights/${nextArticle.slug}`}
                  className="group p-6 border border-border hover:border-accent/30 transition-colors text-right"
                >
                  <span className="text-[11px] font-medium text-muted-foreground tracking-widest uppercase mb-3 flex items-center justify-end gap-2">
                    Next
                    <ArrowRight className="w-3 h-3" strokeWidth={1} />
                  </span>
                  <h4 className="font-serif text-lg group-hover:text-accent transition-colors leading-snug">
                    {nextArticle.title}
                  </h4>
                </Link>
              </div>
            </nav>
          </AnimateOnScroll>
        </div>
      </article>

      <Footer />
    </main>
  )
}
