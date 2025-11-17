"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, Cpu, Globe, Palette, TrendingUp, Users, Sparkles } from "lucide-react"

import useGetAllPosts from "@/hooks/useGetAllPosts"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type CategoryMeta = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  accent: string
  background: string
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  world: {
    name: "World",
    icon: Globe,
    description: "Geopolitics, climate, and diplomacy",
    accent: "text-sky-300",
    background: "from-sky-900/60 to-slate-900/80",
  },
  business: {
    name: "Business",
    icon: Briefcase,
    description: "Markets, companies, and leadership",
    accent: "text-emerald-300",
    background: "from-emerald-900/60 to-slate-900/80",
  },
  technology: {
    name: "Technology",
    icon: Cpu,
    description: "AI, software, and innovation",
    accent: "text-violet-300",
    background: "from-violet-900/60 to-slate-900/80",
  },
  culture: {
    name: "Culture",
    icon: Palette,
    description: "Arts, media, and lifestyle",
    accent: "text-rose-300",
    background: "from-rose-900/60 to-slate-900/80",
  },
  markets: {
    name: "Markets",
    icon: TrendingUp,
    description: "Indices, crypto, and commodities",
    accent: "text-amber-300",
    background: "from-amber-900/60 to-slate-900/80",
  },
  opinion: {
    name: "Opinion",
    icon: Users,
    description: "Editorial views and analysis",
    accent: "text-orange-300",
    background: "from-orange-900/60 to-slate-900/80",
  },
}

export function CategoryGrid() {
  const { data: posts, loading } = useGetAllPosts()

  const categoryStats = useMemo(() => {
    if (!posts) return []
    const map = new Map<string, { count: number; latest: number }>()
    posts.forEach((post) => {
      const key = post.category?.toLowerCase() || "other"
      const record = map.get(key) ?? { count: 0, latest: 0 }
      map.set(key, {
        count: record.count + 1,
        latest: Math.max(record.latest, post._creationTime ?? 0),
      })
    })
    return Array.from(map.entries())
      .map(([key, value]) => ({ slug: key, ...value }))
      .sort((a, b) => b.count - a.count)
  }, [posts])

  const categories = categoryStats.length
    ? categoryStats
    : Object.keys(CATEGORY_META).map((key) => ({ slug: key, count: 0, latest: 0 }))

  const featured = categories[0]

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]" aria-hidden="true" />
      <div className="relative container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-white/60">Browse desk</p>
            <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">Explore by category</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Follow the beats that matter most—from global affairs to disruptive technology and cultural shifts.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Latest editions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured && (
          <Link
            href={`/category/${encodeURIComponent(featured.slug)}`}
            className="mb-10 block rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl transition hover:border-white/30"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit bg-white/10 text-white">
                  <Sparkles className="mr-1 h-3.5 w-3.5" /> Editors’ pick
                </Badge>
                <h3 className="font-serif text-2xl text-white">
                  {CATEGORY_META[featured.slug]?.name ?? featured.slug}
                </h3>
                <p className="text-sm text-white/70">
                  {(CATEGORY_META[featured.slug]?.description ?? "Curated coverage") + " • " + featured.count + " stories"}
                </p>
              </div>
              <div className="text-sm text-white/70">
                Refreshing in-depth coverage. Tap to explore the desk.
              </div>
            </div>
          </Link>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.slice(0, 8).map((category) => {
            const meta = CATEGORY_META[category.slug] ?? {
              name: category.slug,
              icon: Globe,
              description: "Curated coverage",
              accent: "text-white",
              background: "from-slate-900/70 to-slate-900/90",
            }
            const Icon = meta.icon
            return (
              <Link
                key={category.slug}
                href={`/category/${encodeURIComponent(category.slug)}`}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-6 shadow-lg transition hover:-translate-y-1 hover:border-white/30",
                  meta.background,
                )}
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-white/5" />
                </div>
                <div className="relative flex flex-col gap-4 text-white">
                  <div className={cn("w-fit rounded-full border border-white/30 p-3", meta.accent)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">Desk</p>
                    <h3 className="font-serif text-2xl leading-tight">{meta.name}</h3>
                    <p className="mt-2 text-sm text-white/75">{meta.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 text-sm text-white/80">
                    <span>{category.count} stories</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
