export interface Article {
  slug: string
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
  author: {
    name: string
    role: string
  }
  content: string[]
}

export const articles: Article[] = [
  {
    slug: "southeast-asia-digital-economy",
    category: "Market Commentary",
    title: "Southeast Asia's Digital Economy: A $300B Opportunity",
    excerpt:
      "The region's digital economy is projected to reach $300 billion by 2025, driven by rising internet penetration, a young demographic, and increasing smartphone adoption.",
    date: "December 2025",
    readTime: "8 min read",
    author: {
      name: "Sarah Chen",
      role: "Managing Partner",
    },
    content: [
      "Southeast Asia stands at a pivotal moment in its digital transformation. With over 400 million internet users and a median age of just 29, the region presents one of the most compelling investment opportunities of the decade.",
      "The confluence of rising incomes, increasing smartphone penetration, and a burgeoning middle class has created fertile ground for digital businesses. E-commerce, fintech, and digital services are experiencing hypergrowth, with many markets still in the early innings of adoption.",
      "Our analysis suggests three key verticals will drive the majority of value creation: digital financial services, serving the 70% of the population still underbanked; e-commerce and logistics, addressing the fragmented retail landscape; and enterprise software, enabling the digital transformation of traditional industries.",
      "We believe patient capital deployed with deep local expertise can generate exceptional returns while contributing to the region's economic development. Our portfolio companies in Southeast Asia have consistently demonstrated the ability to achieve market leadership through superior execution and localized product development.",
      "The regulatory environment across ASEAN nations continues to mature, with governments increasingly supportive of digital innovation while maintaining appropriate consumer protections. This balanced approach creates a stable foundation for long-term investment.",
    ],
  },
  {
    slug: "latin-american-fintech",
    category: "Investment Outlook",
    title: "Why We're Bullish on Latin American Fintech",
    excerpt:
      "With over 200 million unbanked adults and rapidly improving digital infrastructure, Latin America represents a generational opportunity in financial services.",
    date: "November 2025",
    readTime: "6 min read",
    author: {
      name: "Michael Torres",
      role: "Partner",
    },
    content: [
      "Latin America is experiencing a fintech revolution. The combination of high smartphone penetration, limited traditional banking infrastructure, and a young, digitally-native population has created ideal conditions for disruptive financial services.",
      "Brazil alone has seen fintech adoption rates exceed 70%, among the highest globally. Mexico, Colombia, and Argentina are following similar trajectories, with digital payments and neobanking leading the charge.",
      "Our investment thesis centers on three observations: first, the incumbent banking system remains inefficient and expensive, creating clear value propositions for digital challengers. Second, regulatory frameworks like Open Banking in Brazil are accelerating innovation. Third, the unit economics of digital financial services are fundamentally superior at scale.",
      "We've deployed significant capital across the region's fintech ecosystem, from payments infrastructure to lending platforms to insurance technology. Our portfolio companies serve over 15 million customers combined, with strong retention metrics and expanding margins.",
      "Looking ahead, we see embedded finance and B2B financial services as the next frontiers. As digital commerce grows, the integration of financial services into non-financial platforms will unlock tremendous value. We're positioned to capture this opportunity through strategic partnerships and platform investments.",
    ],
  },
  {
    slug: "measuring-impact-beyond-metrics",
    category: "ESG Insights",
    title: "Measuring Impact: Beyond Traditional Metrics",
    excerpt:
      "How we're evolving our approach to impact measurement, moving beyond simple metrics to capture the full scope of value creation in emerging markets.",
    date: "October 2025",
    readTime: "5 min read",
    author: {
      name: "Dr. Amara Okonkwo",
      role: "Head of ESG",
    },
    content: [
      "Impact measurement in private equity has traditionally focused on easily quantifiable metrics: jobs created, carbon emissions reduced, revenue generated. While these remain important, they tell an incomplete story.",
      "At Bridging Markets, we've developed a more holistic framework that captures both direct and indirect effects of our investments. This includes second-order impacts like supply chain development, knowledge transfer, and ecosystem building.",
      "Our approach integrates three dimensions: economic impact, measuring value creation across stakeholders; social impact, assessing improvements in livelihoods and access to essential services; and environmental impact, evaluating resource efficiency and climate resilience.",
      "Critically, we've moved from point-in-time assessments to longitudinal tracking. This allows us to understand the durability of impact and identify areas for improvement throughout the investment lifecycle.",
      "The results have been illuminating. Our portfolio companies collectively employ over 12,000 people in emerging markets, serve 2 million end customers, and have implemented carbon reduction initiatives saving an estimated 50,000 tonnes of CO2 annually. But beyond the numbers, we've seen communities transformed and industries professionalized.",
    ],
  },
  {
    slug: "infrastructure-investment-africa",
    category: "Market Commentary",
    title: "The Infrastructure Imperative in Sub-Saharan Africa",
    excerpt:
      "Africa's infrastructure gap represents both a challenge and an unprecedented investment opportunity. Here's how we're approaching it.",
    date: "September 2025",
    readTime: "7 min read",
    author: {
      name: "Sarah Chen",
      role: "Managing Partner",
    },
    content: [
      "Sub-Saharan Africa's infrastructure deficit is well documented—the African Development Bank estimates a financing gap of $68-108 billion annually. What's less discussed is how this gap creates compelling opportunities for private capital.",
      "We focus on infrastructure investments that generate both strong financial returns and measurable development impact. Our thesis centers on essential services infrastructure: power generation and distribution, logistics and transportation, and digital connectivity.",
      "The renewable energy sector exemplifies our approach. Africa has abundant solar and wind resources, declining technology costs, and massive unmet demand. Our portfolio company, a distributed solar provider, now serves 300,000 households across three countries with clean, affordable electricity.",
      "Digital infrastructure presents another frontier. With mobile penetration exceeding 80% in many markets but fixed broadband below 5%, there's enormous runway for connectivity investments. We've backed several tower companies and fiber networks serving both consumer and enterprise segments.",
      "Risk management is paramount in these markets. We mitigate political and currency risks through careful structuring, local partnerships, and diversification across countries and sectors. Our track record demonstrates that patient, well-structured capital can achieve institutional-quality returns in African infrastructure.",
    ],
  },
  {
    slug: "ai-emerging-markets",
    category: "Investment Outlook",
    title: "Artificial Intelligence in Emerging Markets: Leapfrog or Lag?",
    excerpt:
      "As AI reshapes global industries, emerging markets face a critical question: will they leapfrog developed economies or fall further behind?",
    date: "August 2025",
    readTime: "6 min read",
    author: {
      name: "Michael Torres",
      role: "Partner",
    },
    content: [
      "The AI revolution is not evenly distributed. While developed markets lead in foundational model development, emerging markets have unique advantages in AI application and deployment.",
      "Three factors support the leapfrog thesis: greenfield opportunity, as emerging markets can build AI-native systems without legacy technology debt; data abundance, with large populations generating vast training datasets; and necessity-driven innovation, where resource constraints drive creative AI applications.",
      "We're seeing this play out across our portfolio. In healthcare, AI-powered diagnostics are extending specialist capabilities to underserved regions. In agriculture, computer vision and predictive analytics are transforming smallholder farming. In financial services, AI-driven underwriting is enabling credit access for the previously unbanked.",
      "However, challenges remain. Talent concentration in developed markets, limited computational infrastructure, and evolving regulatory frameworks create headwinds. Success requires thoughtful approaches to each constraint.",
      "Our investment strategy focuses on applied AI companies solving locally-relevant problems with globally-scalable technology. We believe the winners in emerging market AI will combine deep domain expertise with technical excellence and capital efficiency.",
    ],
  },
  {
    slug: "portfolio-construction-volatile-markets",
    category: "Investment Outlook",
    title: "Portfolio Construction in Volatile Markets",
    excerpt:
      "Navigating currency fluctuations, political transitions, and global uncertainty requires a disciplined approach to portfolio construction.",
    date: "July 2025",
    readTime: "5 min read",
    author: {
      name: "Sarah Chen",
      role: "Managing Partner",
    },
    content: [
      "Emerging market investing has always required comfort with volatility. Recent years have tested even experienced investors, with currency swings, political transitions, and global supply chain disruptions creating a challenging environment.",
      "Our portfolio construction philosophy emphasizes resilience. We build portfolios designed to perform across scenarios, not optimized for any single outcome. This means diversification across geographies, sectors, and business models.",
      "Currency management deserves particular attention. We typically invest in businesses with natural hedges—dollar-linked revenues, local cost structures, or export-oriented models. Where hedging is necessary, we use conservative assumptions and avoid leveraged structures.",
      "Political risk requires nuanced assessment. We distinguish between regime risk and policy risk, focusing on structural reforms rather than individual leaders. Our longest-tenured investments have navigated multiple political transitions successfully.",
      "Most importantly, we maintain significant dry powder and flexible investment mandates. The ability to deploy capital opportunistically during market dislocations has been a consistent driver of returns. Patience and discipline remain our greatest competitive advantages.",
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getAllArticles(): Article[] {
  return articles
}
