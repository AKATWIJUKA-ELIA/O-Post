import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"

import { cn, timeAgo, truncateString } from "@/lib/utils"
import type { StoryLike } from "@/components/story-card"

const FALLBACK_IMAGE = "/placeholder.svg"

const TAG_COLORS = ["text-crimson", "text-sky-600", "text-emerald-600", "text-orange-500", "text-violet-600"]
const TAG_BG = ["bg-crimson", "bg-sky-600", "bg-emerald-600", "bg-orange-500", "bg-violet-600"]

const hash = (value: string) => Array.from(value.toLowerCase()).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
export const tagColor = (category: string) => TAG_COLORS[hash(category) % TAG_COLORS.length]
export const tagBg = (category: string) => TAG_BG[hash(category) % TAG_BG.length]

/** Category label. Pass `plain` when it sits inside another link (anchors can't nest). */
export function Tag({
  category: rawCategory,
  solid = false,
  plain = false,
  className,
}: {
  category: string
  solid?: boolean
  plain?: boolean
  className?: string
}) {
  const category = rawCategory?.trim() || "General"
  const classes = cn(
    "inline-block text-[0.6rem] font-bold uppercase tracking-wider",
    solid ? cn("px-1.5 py-0.5 text-white", tagBg(category)) : tagColor(category),
    className,
  )
  if (plain) return <span className={classes}>{category}</span>
  return (
    <Link
      href={`/category/${encodeURIComponent(category.toLowerCase())}`}
      className={classes}
    >
      {category}
    </Link>
  )
}

function Meta({ story, className, hideAuthor = false }: { story: StoryLike; className?: string; hideAuthor?: boolean }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 whitespace-nowrap text-[0.68rem] text-muted-foreground", className)}>
      {!hideAuthor && story.author?.username && (
        <span className="inline-flex items-center gap-1 font-semibold text-foreground/80">
          <User className="h-3 w-3" /> {story.author.username}
        </span>
      )}
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" /> {timeAgo(story._creationTime ?? 0)}
      </span>
    </p>
  )
}

/** Full-bleed image with the headline over a gradient. */
export function OverlayCard({ story, size = "md", className }: { story: StoryLike; size?: "md" | "lg"; className?: string }) {
  return (
    <article className={cn("group relative overflow-hidden bg-ink", className)}>
      <Link href={`/news/${story._id}`} className="absolute inset-0 z-10" aria-label={story.title} />
      <Image
        src={story.postImage || FALLBACK_IMAGE}
        alt={story.title}
        fill
        priority={size === "lg"}
        sizes={size === "lg" ? "(max-width:1024px) 100vw, 45vw" : "(max-width:1024px) 100vw, 25vw"}
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <Tag category={story.category} solid className="relative z-20 mb-2" />
        <h3
          className={cn(
            "text-balance font-bold leading-snug text-white",
            size === "lg" ? "text-xl sm:text-2xl lg:text-[1.65rem]" : "text-sm sm:text-base",
          )}
        >
          {story.title}
        </h3>
        <Meta story={story} className="mt-2 text-white/70 [&_span]:text-white/70" />
      </div>
    </article>
  )
}

/** White tile: category, headline, meta. */
export function TextTile({ story, className }: { story: StoryLike; className?: string }) {
  return (
    <article className={cn("group bg-card p-4 shadow-sm", className)}>
      <Tag category={story.category} />
      <Link href={`/news/${story._id}`}>
        <h3 className="mt-1 text-sm font-bold leading-snug text-foreground transition group-hover:text-crimson">
          {truncateString(story.title, 90)}
        </h3>
      </Link>
      <Meta story={story} className="mt-2" />
    </article>
  )
}

/** Thumbnail with a rank number (Trending Now). */
export function TrendingItem({ story, rank }: { story: StoryLike; rank: number }) {
  return (
    <article className="group flex gap-3 bg-card p-2 shadow-sm">
      <Link href={`/news/${story._id}`} className="relative h-28 w-36 flex-shrink-0 overflow-hidden bg-muted xl:h-32 xl:w-44">
        <Image src={story.postImage || FALLBACK_IMAGE} alt={story.title} fill sizes="176px" className="object-cover" />
        <span className="absolute bottom-0 left-0 bg-crimson px-2 py-0.5 text-xs font-bold text-white">{rank}</span>
      </Link>
      <div className="min-w-0">
        <Link href={`/news/${story._id}`}>
          <h3 className="text-sm font-bold leading-snug text-foreground transition group-hover:text-crimson">
            {truncateString(story.title, 80)}
          </h3>
        </Link>
        <Meta story={story} hideAuthor className="mt-1" />
      </div>
    </article>
  )
}

/** Image card with tag chip over the image, headline and meta below (Featured Posts). */
export function PostCard({ story, className }: { story: StoryLike; className?: string }) {
  return (
    <article className={cn("group flex flex-col bg-card shadow-sm", className)}>
      <Link href={`/news/${story._id}`} className="relative block aspect-[3/2] overflow-hidden bg-muted">
        <Image
          src={story.postImage || FALLBACK_IMAGE}
          alt={story.title}
          fill
          sizes="(max-width:768px) 100vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Tag category={story.category} />
        <Link href={`/news/${story._id}`}>
          <h3 className="mt-1 text-sm font-bold leading-snug text-foreground transition group-hover:text-crimson">
            {truncateString(story.title, 80)}
          </h3>
        </Link>
        <Meta story={story} className="mt-auto pt-3" />
      </div>
    </article>
  )
}

/** Large image-on-top card with summary (lead of an Express block). */
export function FeatureCard({ story, className }: { story: StoryLike; className?: string }) {
  return (
    <article className={cn("group flex flex-col bg-card shadow-sm", className)}>
      <Link href={`/news/${story._id}`} className="relative block min-h-[14rem] flex-1 overflow-hidden bg-muted">
        <Image
          src={story.postImage || FALLBACK_IMAGE}
          alt={story.title}
          fill
          sizes="(max-width:1024px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <Tag category={story.category} solid plain className="absolute bottom-0 left-0" />
      </Link>
      <div className="flex flex-col p-4">
        <Link href={`/news/${story._id}`}>
          <h3 className="text-base font-bold leading-snug text-foreground transition group-hover:text-crimson">{story.title}</h3>
        </Link>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{truncateString(story.excerpt || story.content || "", 140)}</p>
        <Meta story={story} className="mt-auto pt-3" />
      </div>
    </article>
  )
}

/** Horizontal row: thumbnail left, text right (Express list). */
export function CompactRow({ story, className }: { story: StoryLike; className?: string }) {
  return (
    <article className={cn("group flex gap-3 bg-card p-2 shadow-sm", className)}>
      <Link href={`/news/${story._id}`} className="relative h-28 w-40 flex-shrink-0 overflow-hidden bg-muted xl:h-32 xl:w-48">
        <Image src={story.postImage || FALLBACK_IMAGE} alt={story.title} fill sizes="192px" className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="min-w-0 py-0.5">
        <Tag category={story.category} />
        <Link href={`/news/${story._id}`}>
          <h3 className="mt-0.5 text-[0.82rem] font-bold leading-snug text-foreground transition group-hover:text-crimson">
            {truncateString(story.title, 75)}
          </h3>
        </Link>
        <Meta story={story} className="mt-1.5" />
      </div>
    </article>
  )
}

/** Red-dash section heading with a rule that runs to the edge. */
export function BlockHeading({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span className="h-0.5 w-6 bg-crimson" />
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">{title}</h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
