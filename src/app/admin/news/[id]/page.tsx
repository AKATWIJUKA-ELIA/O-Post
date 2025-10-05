import { ArrowLeft, Share2, Bookmark, Twitter, Facebook, Linkedin, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { use } from "react"
import useGetAllPosts from "@/hooks/useGetAllPosts"

// Mock data - replace with actual data fetching
const article = {
  id: "1",
  title: "The Future of Artificial Intelligence in Modern Journalism",
  subtitle: "How AI is transforming newsrooms and reshaping the way we consume information",
  author: {
    name: "Sarah Mitchell",
    role: "Senior Technology Reporter",
    avatar: "/professional-journalist.png",
  },
  publishedDate: "March 15, 2025",
  readTime: "8 min read",
  category: "Technology",
  source: "Tech Insights",
  image: "/ai-technology-newsroom.jpg",
  content: [
    "Artificial intelligence is no longer a distant concept confined to science fiction. It has become an integral part of our daily lives, transforming industries and reshaping the way we work, communicate, and consume information. In the realm of journalism, AI is proving to be both a powerful tool and a subject of intense debate.",
    "Newsrooms around the world are increasingly adopting AI-powered tools to streamline their workflows, from automated content generation to sophisticated data analysis. These technologies are enabling journalists to process vast amounts of information more efficiently, uncover hidden patterns in data, and deliver personalized content to their audiences.",
    "However, the integration of AI in journalism also raises important questions about authenticity, bias, and the future role of human journalists. As algorithms become more sophisticated in generating and curating content, the industry must grapple with maintaining editorial integrity while embracing technological innovation.",
    "Major news organizations have already begun experimenting with AI-generated articles for routine reporting tasks such as financial updates, sports scores, and weather forecasts. This automation frees up human journalists to focus on more complex investigative work and in-depth analysis that requires critical thinking and emotional intelligence.",
    "The challenge lies in finding the right balance between efficiency and quality, between automation and human touch. While AI can process information at unprecedented speeds, it lacks the nuanced understanding of context, ethics, and human experience that seasoned journalists bring to their work.",
    "Looking ahead, the most successful newsrooms will likely be those that view AI not as a replacement for human journalists, but as a powerful complement to their skills. By leveraging AI for data processing and routine tasks, journalists can dedicate more time to what they do best: telling compelling stories, holding power to account, and serving their communities with thoughtful, well-researched journalism.",
  ],
}

const relatedArticles = [
  {
    id: "2",
    title: "Machine Learning Algorithms Detect Misinformation Faster Than Ever",
    category: "Technology",
    date: "March 14, 2025",
    readTime: "5 min read",
  },
  {
    id: "3",
    title: "The Ethics of Automated Journalism: A Deep Dive",
    category: "Opinion",
    date: "March 12, 2025",
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "How Newsrooms Are Training Journalists to Work with AI",
    category: "Industry",
    date: "March 10, 2025",
    readTime: "7 min read",
  },
]
interface PageProps {
        params: Promise<{ id: string }>
      }
export default function NewsArticlePage({ params }: PageProps) {
        const { id } = use(params);
          const { data: relatedProducts } = useGetAllPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category & Metadata */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{article.category}</span>
          <span>{article.publishedDate}</span>
          <span>•</span>
          <span>{article.readTime}</span>
          <span>•</span>
          <span>{article.source}</span>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-pretty text-xl leading-relaxed text-muted-foreground sm:text-2xl">{article.subtitle}</p>

        {/* Author Info */}
        <div className="mb-8 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
            <AvatarFallback>
              {article.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{article.author.name}</p>
            <p className="text-sm text-muted-foreground">{article.author.role}</p>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Featured Image */}
        <div className="mb-12 overflow-hidden rounded-lg">
          <img src={article.image || "/placeholder.svg"} alt={article.title} className="h-auto w-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          {article.content.map((paragraph, index) => (
            <p key={index} className="mb-6 text-pretty leading-relaxed text-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Share Section */}
        <div className="mb-12">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Share this article</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Link2 className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>

        {/* Author Bio */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
              <AvatarFallback>
                {article.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="mb-1 font-semibold text-foreground">{article.author.name}</h4>
              <p className="mb-2 text-sm text-muted-foreground">{article.author.role}</p>
              <p className="text-sm leading-relaxed text-foreground">
                Sarah is an award-winning technology journalist with over a decade of experience covering the
                intersection of technology and society. She specializes in AI, digital ethics, and the future of media.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-serif text-3xl font-bold text-foreground">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/news/${related.id}`}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">
                    {related.category}
                  </span>
                  <span>{related.date}</span>
                </div>
                <h3 className="mb-2 text-balance font-semibold leading-snug text-foreground group-hover:text-primary">
                  {related.title}
                </h3>
                <p className="text-sm text-muted-foreground">{related.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
