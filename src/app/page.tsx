
import { HeroSection } from "@/src/components/hero-section"
import { FeaturedStories } from "@/src/components/featured-stories"
import { CategoryGrid } from "@/src/components/category-grid"
import { LatestNews } from "@/src/components/latest-news"
import { Newsletter } from "@/src/components/newsletter"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main>
        <HeroSection />
        <FeaturedStories />
        <CategoryGrid />
        <LatestNews />
        <Newsletter />
      </main>
      
    </div>
  )
}
