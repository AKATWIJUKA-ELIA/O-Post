import { ArrowRight } from "lucide-react"

const stories = [
  {
    category: "Technology",
    title: "AI Revolution Transforms Healthcare Industry",
    excerpt: "New artificial intelligence systems are helping doctors diagnose diseases with unprecedented accuracy.",
    author: "James Chen",
    date: "March 14, 2025",
    image: "/ai-healthcare-technology-medical.jpg",
  },
  {
    category: "Business",
    title: "Markets Rally on Economic Recovery Signs",
    excerpt: "Global stock markets surge as economic indicators point to sustained growth across major economies.",
    author: "Emily Rodriguez",
    date: "March 14, 2025",
    image: "/stock-market-trading-floor-business.jpg",
  },
  {
    category: "Culture",
    title: "Renaissance of Independent Cinema",
    excerpt: "Film festivals showcase a new wave of independent filmmakers challenging Hollywood conventions.",
    author: "Michael Park",
    date: "March 13, 2025",
    image: "/cinema-film-festival-movie-theater.jpg",
  },
]

export function FeaturedStories() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Featured Stories</h2>
          <a
            href="#"
            className="hidden sm:inline-flex items-center space-x-2 text-sm font-medium text-secondary hover:text-foreground transition-colors group"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-4">
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">{story.category}</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground group-hover:text-secondary transition-colors leading-tight text-balance">
                  {story.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{story.excerpt}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{story.author}</span>
                  <span>•</span>
                  <time>{story.date}</time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
