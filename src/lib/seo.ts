import { cache } from "react"
import { fetchQuery } from "convex/nextjs"

import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { BASE_URL } from "@/lib/urls"

export const SITE_NAME = "The O-Post"
export const SITE_TAGLINE = "Accurate and Realistic News"
export const SITE_DESCRIPTION =
  "The O-Post brings you accurate and realistic news from Uganda and around the world: politics, business, sports, technology, culture and more."

/** Absolute URL for a site path, e.g. absoluteUrl("/news/123"). */
export const absoluteUrl = (path = "/") => new URL(path, BASE_URL).toString()

/** Plain-text summary suitable for meta descriptions (~160 chars). */
export const summarize = (text: string | undefined, max = 160) => {
  const clean = (text ?? "").replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean
}

export const titleCase = (value: string) =>
  value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

/** Fetch one post on the server. Returns null for unknown or malformed ids. Cached per request. */
export const getPostForSeo = cache(async (id: string) => {
  try {
    const result = await fetchQuery(api.posts.GetPostById, { postId: id as Id<"posts"> })
    return result.post ?? null
  } catch {
    return null
  }
})

export const getAllPostsForSeo = cache(async () => {
  try {
    return await fetchQuery(api.posts.GetAllPosts, {})
  } catch {
    return []
  }
})

/** Author display name only; never pass the full user record (it includes sensitive fields) to the page. */
export const getAuthorNameForSeo = cache(async (id: string | undefined) => {
  if (!id) return null
  try {
    const user = await fetchQuery(api.users.GetUserById, { id: id as Id<"users"> })
    return user?.username ?? null
  } catch {
    return null
  }
})
