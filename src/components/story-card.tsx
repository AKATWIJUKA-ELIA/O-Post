import Image from "next/image"
import Link from "next/link"

import { cn, formatShortDate, truncateString } from "@/lib/utils"

const FALLBACK_IMAGE = "/placeholder.svg"

export type StoryLike = {
  _id: string
  title: string
  excerpt?: string
  content?: string
  category: string
  postImage?: string | null
  _creationTime?: number
  author?: { username?: string } | null
}

type Variant = "lead" | "card" | "row" | "text"

const summary = (story: StoryLike, max: number) => truncateString(story.excerpt || story.content || "", max)

function Byline({ story, className }: { story: StoryLike; className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      {story.author?.username && <span className="font-semibold text-foreground/80">{story.author.username}</span>}
      {story.author?.username && <span className="mx-1.5">·</span>}
      <time>{formatShortDate(story._creationTime ?? 0)}</time>
    </p>
  )
}

/**
 * One story, four layouts:
 * - lead: large image, big serif headline, summary (front-page lead)
 * - card: image on top, headline, short summary
 * - row: small thumbnail beside headline
 * - text: headline only, for dense lists
 */
export function StoryCard({ story, variant = "card", className }: { story: StoryLike; variant?: Variant; className?: string }) {
  const href = `/news/${story._id}`

  if (variant === "lead") {
    return (
      <article className={cn("group", className)}>
        <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={story.postImage || FALLBACK_IMAGE}
            alt={story.title}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="pt-4">
          <p className="kicker">{story.category}</p>
          <Link href={href}>
            <h2 className="mt-2 text-balance font-serif text-3xl font-bold leading-[1.15] tracking-tight text-foreground transition group-hover:text-primary md:text-4xl lg:text-[2.6rem]">
              {story.title}
            </h2>
          </Link>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {summary(story, 220)}
          </p>
          <Byline story={story} className="mt-4" />
        </div>
      </article>
    )
  }

  if (variant === "row") {
    return (
      <article className={cn("group", className)}>
        <Link href={href} className="flex gap-4">
          <div className="min-w-0 flex-1">
            <p className="kicker">{story.category}</p>
            <h3 className="mt-1 text-balance font-serif text-base font-bold leading-snug text-foreground transition group-hover:text-primary group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:text-lg">
              {truncateString(story.title, 110)}
            </h3>
            <Byline story={story} className="mt-2" />
          </div>
          <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden bg-muted sm:h-24 sm:w-32">
            <Image
              src={story.postImage || FALLBACK_IMAGE}
              alt={story.title}
              fill
              sizes="128px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      </article>
    )
  }

  if (variant === "text") {
    return (
      <article className={cn("group", className)}>
        <Link href={href} className="block">
          <h3 className="text-balance font-serif text-base font-bold leading-snug text-foreground transition group-hover:text-primary group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
            {truncateString(story.title, 120)}
          </h3>
          <Byline story={story} className="mt-1" />
        </Link>
      </article>
    )
  }

  return (
    <article className={cn("group flex h-full flex-col", className)}>
      <Link href={href} className="relative block aspect-[3/2] overflow-hidden bg-muted">
        <Image
          src={story.postImage || FALLBACK_IMAGE}
          alt={story.title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <p className="kicker">{story.category}</p>
        <Link href={href}>
          <h3 className="mt-1.5 text-balance font-serif text-xl font-bold leading-snug text-foreground transition group-hover:text-primary">
            {story.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary(story, 120)}</p>
        <Byline story={story} className="mt-auto pt-3" />
      </div>
    </article>
  )
}

export function SectionHeading({ title, kicker, href }: { title: string; kicker?: string; href?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between border-b-2 border-foreground pb-2">
      <div>
        {kicker && <p className="kicker mb-0.5">{kicker}</p>}
        <h2 className="section-title">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-primary">
          View all →
        </Link>
      )}
    </div>
  )
}
