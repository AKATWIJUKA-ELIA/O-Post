
import { HeroSection } from "@/components/hero-section"
import { FeaturedStories } from "@/components/featured-stories"
import { CategoryGrid } from "@/components/category-grid"
import { LatestNews } from "@/components/latest-news"
import { Newsletter } from "@/components/newsletter"


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
