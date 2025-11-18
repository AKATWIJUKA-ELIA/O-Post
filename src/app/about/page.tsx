import Link from "next/link"
import { ArrowUpRight, CheckCircle2, Mail, Newspaper, Target, Users2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { title: "Daily readers", value: "120K+", detail: "across web and newsletter" },
  { title: "Stories published", value: "9,400", detail: "original investigations" },
  { title: "Contributors", value: "85", detail: "reporters, editors, partners" },
  { title: "Regions covered", value: "32", detail: "countries in our network" }
]

const values = [
  {
    title: "Radical transparency",
    description: "We publish sources, context, and the decisions behind every investigation.",
    icon: CheckCircle2
  },
  {
    title: "Community-first",
    description: "Readers shape our newsroom agenda through town halls, polls, and open inboxes.",
    icon: Users2
  },
  {
    title: "Impact over clicks",
    description: "We measure success by policy change, not page views.",
    icon: Target
  }
]

const milestones = [
  {
    year: "2017",
    title: "Origins as a student paper",
    copy: "Four journalists launched O-Media to counter disinformation swirling on campus."
  },
  {
    year: "2020",
    title: "Convex-powered newsroom",
    copy: "We rebuilt our stack around real-time collaboration so tips become stories faster."
  },
  {
    year: "2023",
    title: "Audience-funded expansion",
    copy: "Memberships unlocked bureaus in Nairobi, Lagos, and Kigali focused on civic issues."
  },
  {
    year: "Today",
    title: "Focused on the next decade",
    copy: "We are investing in investigative pods, classroom kits, and explainers for global youth."
  }
]

const editors = [
  {
    name: "Amelia Ndagire",
    title: "Editor in Chief",
    bio: "Guides editorial standards and our human-centered storytelling playbook."
  },
  {
    name: "Kato Musinguzi",
    title: "Investigations Lead",
    bio: "Runs cross-border collaborations that expose corruption and spur reform."
  },
  {
    name: "Lynn Mbabazi",
    title: "Audience Director",
    bio: "Designs community programs, newsletter experiments, and membership perks."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-sm text-primary">
          <span>About O-Media</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
        <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          Independent storytelling built with community accountability
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          We are a distributed newsroom using technology, curiosity, and radical transparency to surface the stories
          that help people make informed decisions. Every feature, investigation, and newsletter is handcrafted by
          journalists living alongside the communities they cover.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="lg" className="rounded-full px-8">
            Partner with us
          </Button>
          <Button variant="outline" size="lg" className="rounded-full" asChild>
            <Link href="/newsletter">Join the newsletter</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.title} className="rounded-2xl border border-border/60 bg-background/40 p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.title}</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-primary/30 bg-primary/5 p-8">
            <Badge variant="secondary" className="rounded-full">
              Our mission
            </Badge>
            <h2 className="text-3xl font-serif font-semibold text-foreground">Amplify voices closest to the impact.</h2>
            <p className="text-lg text-muted-foreground">
              Our reporters live where they report. They host listening sessions every Friday, invite readers into
              drafting rooms, and publish the receipts behind every claim. Technology helps us move fast—but people and
              their lived experiences guide everything we publish.
            </p>
            <div className="grid gap-4">
              {values.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="border-border/70 bg-background/70">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/80 p-8">
            <Badge variant="outline" className="rounded-full">
              Our story
            </Badge>
            <div className="mt-6 space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="rounded-2xl border border-border/60 bg-background/30 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">{milestone.year}</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{milestone.title}</p>
                  <p className="text-sm text-muted-foreground">{milestone.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/70 bg-card/80 p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="secondary" className="rounded-full">
                Editorial desk
              </Badge>
              <h2 className="mt-3 text-3xl font-serif font-semibold text-foreground">Meet the editors stewarding the work.</h2>
            </div>
            <Button variant="ghost" className="gap-2 text-muted-foreground" asChild>
              <Link href="/profile">Explore newsroom roles</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {editors.map((editor) => (
              <Card key={editor.name} className="border-border/70 bg-background/60">
                <CardContent className="space-y-3 p-6">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{editor.name}</p>
                    <p className="text-sm text-muted-foreground">{editor.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{editor.bio}</p>
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <Mail className="h-4 w-4" />
                    Say hello
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 px-8 py-12 shadow-lg shadow-primary/10">
          <Badge className="rounded-full bg-primary text-primary-foreground">
            Stay in the loop
          </Badge>
          <h2 className="mt-5 text-3xl font-serif font-semibold text-foreground sm:text-4xl">
            Get our weekend brief before it trends
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Every Saturday we send a handcrafted recap outlining the most important investigations, wins from the
            community, and what we are chasing next.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2 rounded-full" asChild>
              <Link href="/newsletter">
                <Newspaper className="h-5 w-5" />
                Subscribe free
              </Link>
            </Button>
            {/* <Button variant="ghost" size="lg" className="rounded-full text-muted-foreground" asChild>
              <Link href="/contact">Pitch a story</Link>
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  )
}
