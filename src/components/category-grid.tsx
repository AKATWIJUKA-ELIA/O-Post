import { Globe, Briefcase, Cpu, Palette, TrendingUp, Users } from "lucide-react"

const categories = [
  {
    name: "World",
    icon: Globe,
    count: 234,
    color: "text-blue-600",
  },
  {
    name: "Business",
    icon: Briefcase,
    count: 189,
    color: "text-green-600",
  },
  {
    name: "Technology",
    icon: Cpu,
    count: 156,
    color: "text-purple-600",
  },
  {
    name: "Culture",
    icon: Palette,
    count: 142,
    color: "text-pink-600",
  },
  {
    name: "Markets",
    icon: TrendingUp,
    count: 98,
    color: "text-orange-600",
  },
  {
    name: "Opinion",
    icon: Users,
    count: 87,
    color: "text-red-600",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Explore by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <a
                key={category.name}
                href="#"
                className="group bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-border hover:border-secondary"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`${category.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.count} articles</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
