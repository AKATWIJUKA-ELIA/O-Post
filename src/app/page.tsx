import { HeroSection } from "@/components/hero-section"
import { FeaturedStories } from "@/components/featured-stories"
import { CategoryGrid } from "@/components/category-grid"
import { LatestNews } from "@/components/latest-news"
import { Newsletter } from "@/components/newsletter"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, absoluteUrl } from "@/lib/seo"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsMediaOrganization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/logo.png"),
      slogan: SITE_TAGLINE,
      email: "press@omedia.com",
      telephone: "+256760929501",
      sameAs: ["https://x.com/JoshuaK22038"],
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteUrl("/")}#website`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    },
  ],
}

export default function HomePage() {
  return (
    <main className="w-full bg-[#f4f4f6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">
        {SITE_NAME}: {SITE_TAGLINE}
      </h1>
      <HeroSection />
      <FeaturedStories />
      <CategoryGrid />
      <LatestNews />
      <Newsletter />
    </main>
  )
}
