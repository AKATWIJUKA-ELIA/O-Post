import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Rss, Send, Phone, Mail, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { currentYear } from "@/lib/utils"
import Image from "next/image"
import { BASE_URL } from "@/lib/urls"

const navigation = [
  {
    title: "Coverage",
    links: [
      { label: "Politics", href: "/category/politics" },
      { label: "Business", href: "/category/business" },
      { label: "Technology", href: "/category/technology" },
      { label: "Culture", href: "/category/culture" }
    ]
  },
//   {
//     title: "Company",
//     links: [
//       { label: "About", href: "/about" },
//       { label: "Newsroom", href: "/profile" },
//       { label: "Careers", href: "/career" },
//       { label: "Advertise", href: "/contact" }
//     ]
//   },
//   {
//     title: "Resources",
//     links: [
//       { label: "Press kit", href: "/press" },
//       { label: "Media kit", href: "/press" },
//       { label: "Community", href: "/about" },
//       { label: "Editorial standards", href: "/about" }
//     ]
//   }
]

const newsroomHighlights = [
  { label: "Sports", description: "Discover the latest in sports", href: `${BASE_URL}/category/sports` },
  { label: "Politics", description: "How politics impacts the nation", href: `${BASE_URL}/category/politics` },
  { label: "Technology", description: "The future is Closer then You think and its Tech", href: `${BASE_URL}/category/technology` }
]

const socialLinks = [
//   { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "Twitter", icon: Twitter, href: "https://x.com/JoshuaK22038" },
//   { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
//   { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
//   { label: "YouTube", icon: Youtube, href: "https://youtube.com" },
//   { label: "RSS", icon: Rss, href: "/rss" }
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-zinc-950 to-black text-primary-foreground">
      <div className="mx-auto ">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
                Independent newsroom
              </p>
              <h2 className="mt-4 text-3xl font-serif font-semibold sm:text-4xl">
                Stories that earn trust, delivered straight to your inbox.
              </h2>
              <p className="mt-3 text-base text-white/80">
                Join 120,000+ readers getting our investigations, explainers, and weekend brief before they trend.
              </p>
            </div>
            
          </div>

          <div className="flex flex-col md:flex-row p-4 gap-3 " >
                <div className="grid gap-2 lg:grid-cols-3 ">
            <div>
              <p className="font-serif text-4xl font-bold">O-Media</p>
              <p className="mt-3 text-sm text-white/70">
                Reporting across Africa and the global south with context, empathy, and accountability.
              </p>
              <div className="mt-4 text-sm text-white/60">
                <p>Press hotline</p>
                <a href="mailto:press@omedia.com" className="text-white hover:text-primary-foreground">
                  press@omedia.com
                </a>
              </div>
            </div>
            {navigation.map((section) => (
              <div key={section.title}>
                <p className="text-sm font-semibold uppercase tracking-wide text-white/70">{section.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex bg-white  md:w-[40%] rounded-4xl border-2 border-blue p-3" >
               <Link href="/">
                <Image src="/logo.png" alt="Description" width={700} height={300} />
                </Link>
          </div>
          </div>

          <div className="grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Newsroom highlights</p>
              <div className="mt-4 space-y-3">
                {newsroomHighlights.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 transition hover:border-white/30">
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-white/70">{item.description}</p>
                    </div>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Contact & offices</p>
              <div>
              <h4 className="font-bold text-lg text-white mb-4 dark:text-gray-100">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-600 mt-0.5 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    32 km Gayaza-Zirobwe Rd
                    <br />
                    Bugema University
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <a href="tel: +256 760 929501"> +256 760 929501</a>
                  </span>
                </div>
                {/* <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <a href="mailto: eliaakjtrnq@gmail.com">eliaakjtrnq@gmail.com</a>
                  </span>
                </div> */}
      
                {/* Social Media */}
                <div className="mt-6">
                  <h5 className="font-medium text-gold mb-3">Follow Us</h5>
                  <div className="flex space-x-4">
                    {/* <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Facebook className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">Facebook</span>
                    </a> */}
                    {/* <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Instagram className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">Instagram</span>
                    </a> */}
                    <a
                      href="https://x.com/JoshuaK22038"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Twitter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">Twitter</span>
                    </a>
                    {/* <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Youtube className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">YouTube</span>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/70 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-widest text-white/50">
              
              <Link href="/" className="hover:text-white">
                Privacy policy
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-white">
                Terms of service
              </Link>
              <span>•</span>
              
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-white/40 hover:text-white">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <p className="border-t border-white/10 pt-6 text-center text-xs text-white/60">© {currentYear()} O-Media. Independent journalism funded by readers like you.</p>
        </div>
      </div>
    </footer>
  )
}
