
import { HeroSection } from "@/components/hero-section"
import { FeaturedStories } from "@/components/featured-stories"
import { CategoryGrid } from "@/components/category-grid"
import { LatestNews } from "@/components/latest-news"
import { Newsletter } from "@/components/newsletter"


export default function HomePage() {
  return (
    <div className="flex min-h-screen overflow-x-hidden w-full mx-auto bg-background">
      
      <main className="">
        <HeroSection />
        <FeaturedStories />
        <CategoryGrid />
        <LatestNews />
        <Newsletter />
      </main>
      
    </div>
  )
}
