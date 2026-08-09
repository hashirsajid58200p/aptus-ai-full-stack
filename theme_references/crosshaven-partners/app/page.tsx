import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { TrustedBy } from "@/components/trusted-by"
import { About } from "@/components/about"
import { InvestmentThesis } from "@/components/investment-thesis"
import { Portfolio } from "@/components/portfolio"
import { CaseStudies } from "@/components/case-studies"
import { ESG } from "@/components/esg"
import { Team } from "@/components/team"
import { Insights } from "@/components/insights"
import { ContactCTA } from "@/components/contact-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Stats />
      <TrustedBy />
      <About />
      <InvestmentThesis />
      <Portfolio />
      <CaseStudies />
      <ESG />
      <Team />
      <Insights />
      <ContactCTA />
      <Footer />
    </main>
  )
}
