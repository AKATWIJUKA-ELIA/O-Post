import Link from "next/link"
import { CheckCircle2, Mail, MapPin, Phone, Scale, Users2 } from "lucide-react"

import { Newsletter } from "@/components/newsletter"

const values = [
  {
    title: "Accurate",
    description: "We check our facts and correct our mistakes openly.",
    icon: CheckCircle2,
  },
  {
    title: "Realistic",
    description: "We report what happened and give the context to understand why it matters.",
    icon: Scale,
  },
  {
    title: "Community-minded",
    description: "We cover the stories that matter to our readers and welcome their voices in the discussion.",
    icon: Users2,
  },
]

const sections = ["World", "Politics", "Business", "Technology", "Culture", "Science", "Health", "Sports", "Travel", "Opinion", "Lifestyle", "Education"]

export const metadata = {
  title: "About us",
  description: "About The O-Post: independent, accurate and realistic news from O-Media, based at Bugema University, Uganda.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <main className="bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="kicker">About us</p>
          <h1 className="mt-2 text-balance font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Accurate and realistic news.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The O-Post, published by O-Media, is an independent news platform. We bring readers clear reporting and
            commentary across the topics that shape their lives.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 border-b-2 border-foreground pb-2 font-serif text-2xl font-bold">What we stand for</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {values.map(({ title, description, icon: Icon }) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-serif text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 border-b-2 border-foreground pb-2 font-serif text-2xl font-bold">What we cover</h2>
          <ul className="flex flex-wrap gap-2">
            {sections.map((name) => (
              <li key={name}>
                <Link
                  href={`/category/${name.toLowerCase()}`}
                  className="inline-block border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 border-b-2 border-foreground pb-2 font-serif text-2xl font-bold">Contact the newsroom</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> 32 km Gayaza-Zirobwe Rd, Bugema University
          </li>
          <li className="flex items-center gap-3">
            <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
            <a href="tel:+256760929501" className="hover:text-primary">+256 760 929501</a>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
            <a href="mailto:press@omedia.com" className="hover:text-primary">press@omedia.com</a>
          </li>
        </ul>
      </section>

      <Newsletter />
    </main>
  )
}
