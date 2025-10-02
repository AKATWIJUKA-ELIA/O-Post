export type Post = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  imageUrl: string
  publishedAt: string
  status: "draft" | "published"
}