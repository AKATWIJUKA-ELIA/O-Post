"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Flame, Clock, Newspaper } from "lucide-react"

import useGetAllPosts from "@/hooks/useGetAllPosts"
import { getUserById } from "@/lib/convex"
import { Id } from "../../convex/_generated/dataModel"
import { User } from "@/lib/types"
import { cn, formatDate, truncateString } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Loader from "./Loader/loader"

const FALLBACK_IMAGE = "/placeholder.svg"

export function HeroSection() {
  const { data: posts } = useGetAllPosts()
  const mainPost = posts?.[0] ?? null
  const highlightPosts = useMemo(() => posts?.slice(1, 5) ?? [], [posts])
  const [author, setAuthor] = useState<User | null>(null)

  useEffect(() => {
    if (!mainPost) return
    async function fetchAuthor() {
      if (!mainPost) return
      const response = await getUserById(mainPost.authorId as Id<"users">)
      setAuthor(response.user)
    }
    fetchAuthor()
  }, [mainPost])

  if (!posts) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader />
      </div>
    )
  }

  if (!mainPost) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-muted-foreground">
        No stories to display yet.
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-500 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_50%)]" />
      <div className="relative container px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Badge variant="secondary" className="bg-amber-400/20 text-amber-300">
            <Flame className="mr-1 h-3.5 w-3.5" /> Trending now
          </Badge>
          <span className="hidden text-slate-400 md:inline">/</span>
          <span className="text-slate-400">Fresh perspectives from O-Post newsroom</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* Featured story */}
          <article className="group rounded-3xl border border-white/5 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="relative h-[420px] w-full overflow-hidden rounded-3xl">
              <Image
                src={mainPost.postImage || FALLBACK_IMAGE}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                alt={mainPost.title}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
                <Badge variant="outline" className="absolute top-3 left-4 bg-blue rounded-3xl p-3 flex flex-wrap items-center gap-3 text-xs text-slate-200 border-white/40  ">
                    {mainPost.category}
                     <span className="text-white/70">By {author?.username ?? "Editorial Team"}</span>
                  </Badge>
              <div className="absolute inset-x-0 bottom-0 space-y-4 p-7">
                
                <h1 className="font-serif text-3xl leading-tight tracking-tight text-white drop-shadow md:text-4xl lg:text-5xl">
                  {mainPost.title}
                </h1>
              </div>
            </div>

            <div className="space-y-6 p-8">
              <p className="text-lg text-slate-200 md:text-xl">
                {truncateString(mainPost.excerpt ?? "", 220)}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Updated {formatDate(mainPost._creationTime ?? 0)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Newspaper className="h-4 w-4" /> Feature story
                </span>
              </div>
              <Button asChild variant="secondary" className="group inline-flex w-fit items-center gap-2 rounded-full px-6 py-2 text-base">
                <Link href={`/news/${mainPost._id}`}>
                  Read full story
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </article>

          {/* Spotlight list */}
          <aside className="rounded-3xl border border-white/5 bg-white/3 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">In case you missed it</p>
                <h2 className="text-2xl font-semibold text-white">Latest spotlight</h2>
              </div>
            </div>

            <div className="space-y-4">
              {highlightPosts.length === 0 && (
                <p className="text-sm text-white/60">Fresh stories will appear here as soon as they are published.</p>
              )}

              {highlightPosts.map((story) => (
                <Link
                  key={String(story._id)}
                  href={`/news/${story._id}`}
                  className="group flex gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-3 transition hover:border-white/20"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl">
                    <Image
                      src={story.postImage || FALLBACK_IMAGE}
                      fill
                      sizes="96px"
                      alt={story.title}
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{story.category}</p>
                      <h3 className="font-semibold text-white transition group-hover:text-amber-200">
                        {truncateString(story.title, 90)}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>{formatDate(story._creationTime ?? 0)}</span>
                      <span>•</span>
                      <span>{truncateString(story.excerpt ?? "", 60)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
