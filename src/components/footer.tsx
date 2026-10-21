import Link from "next/link"
import { ArrowUp, Mail, MapPin, Phone, Twitter } from "lucide-react"

import { currentYear } from "@/lib/utils"

const sections = [
  {
    title: "News",
    links: [
      { label: "World", href: "/category/world" },
      { label: "Politics", href: "/category/politics" },
      { label: "Business", href: "/category/business" },
      { label: "Technology", href: "/category/technology" },
      { label: "Science", href: "/category/science" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Sports", href: "/category/sports" },
      { label: "Culture", href: "/category/culture" },
      { label: "Health", href: "/category/health" },
      { label: "Travel", href: "/category/travel" },
      { label: "Opinion", href: "/category/opinion" },
    ],
  },
  {
    title: "The O-Post",
    links: [
      { label: "About us", href: "/about" },
      { label: "Newsletter", href: "/#newsletter" },
      { label: "Your account", href: "/profile" },
      { label: "Log in", href: "/sign-in" },
    ],
  },
]

const contact = [
  { icon: MapPin, label: "32 km Gayaza-Zirobwe Rd, Bugema University" },
  { icon: Phone, label: "+256 760 929501", href: "tel:+256760929501" },
  { icon: Mail, label: "press@omedia.com", href: "mailto:press@omedia.com" },
]

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
      <span className="h-0.5 w-5 bg-crimson" />
      {children}
    </h3>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#0d0d12] text-white">
      <div className="mx-auto w-[95%] py-14 xl:w-[85%]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr] lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="The O-Post home" className="inline-block bg-white p-1 shadow-md">
              <img src="/logo.png" alt="The O-Post" className="h-14 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Independent reporting with context and accountability. Accurate and realistic news from Uganda and beyond.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://x.com/JoshuaK22038"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-crimson hover:text-white"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Follow us on X (Twitter)</span>
              </a>
              <a
                href="mailto:press@omedia.com"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-crimson hover:text-white"
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email the newsroom</span>
              </a>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <ColumnTitle>{section.title}</ColumnTitle>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
                    >
                      <span className="h-px w-0 bg-crimson transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <ColumnTitle>Contact us</ColumnTitle>
            <ul className="space-y-4">
              {contact.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-start gap-3 text-sm text-white/65">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white/5 text-crimson ring-1 ring-white/10">
                    <Icon className="h-4 w-4" />
                  </span>
                  {href ? (
                    <a href={href} className="pt-1.5 transition hover:text-white">
                      {label}
                    </a>
                  ) : (
                    <span className="pt-1.5">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/40">
        <div className="mx-auto flex w-[95%] flex-col gap-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between xl:w-[85%]">
          <p>
            © {currentYear()} <span className="font-semibold text-white/75">O-Media</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/" className="transition hover:text-white">
              Privacy policy
            </Link>
            <Link href="/" className="transition hover:text-white">
              Terms of service
            </Link>
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-crimson text-white transition hover:bg-white hover:text-crimson"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
