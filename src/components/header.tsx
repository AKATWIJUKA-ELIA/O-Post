"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogIn, Twitter } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import type { Id } from "../../convex/_generated/dataModel"
import type { User, UserProfile } from "@/lib/types"
import useLogout from "@/hooks/useLogout"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getUserById } from "@/lib/convex"
import { LogOut as SignOut } from "lucide-react"
import { cn } from "@/lib/utils"


const links: { name: string; href: string }[] = [
  { name: "World", href: "world" },
  { name: "Politics", href: "politics" },
  { name: "Business", href: "business" },
  { name: "Technology", href: "technology" },
  { name: "Culture", href: "culture" },
  { name: "Science", href: "science" },
  { name: "Health", href: "health" },
  { name: "Sports", href: "sports" },
  { name: "Travel", href: "travel" },
  { name: "Opinion", href: "opinion" },
  { name: "Lifestyle", href: "lifestyle" },
  { name: "Education", href: "education" },
]

export function Header() {
  const pathname = usePathname()
  const { LogOut } = useLogout()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
        const [Author, setAuthor] = useState<User | null>(null);

useEffect(()=>{(
        async()=>{
        const{success,session}=await useUser();
        if(success&&session){
                setUser({
                        userId:session.userId as Id<"users">,
                        role:session.role as string,
                        isVerified:session.isVerified as boolean,
                        expiresAt:session.expiresAt as Date,});
                        return;
                }
                        setUser(null);
                })();
        },[pathname]);

                        useEffect(()=>{
                                                async function fetchAuthor(){
                                                        const response = await getUserById(user?.userId as Id<"users">);
                                                        setAuthor(response.user);
                                                }
                                                fetchAuthor();
                                          },[user?.userId])

  const handleLogout = async () => {
    await LogOut().then((data) => {
      if (data?.success) {
        setUser(null)
      }
    })
  }

  if (pathname.includes("admin")) {
    return null
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  const activeSlug = pathname.startsWith("/category/") ? decodeURIComponent(pathname.split("/")[2] ?? "") : null

  const authControls = user?.userId ? (
    <div className="flex items-center gap-3">
      <Link href="/profile" className="flex items-center gap-2" aria-label="Your profile">
        <Avatar className="h-6 w-6">
          <AvatarImage src={Author?.profilePicture || undefined} alt="Your avatar" />
          <AvatarFallback className="bg-crimson text-[0.65rem] text-white">
            {Author?.username ? Author.username.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-xs text-white/80 sm:inline">{Author?.username}</span>
      </Link>
      <button onClick={handleLogout} className="inline-flex items-center gap-1 text-xs text-white/70 transition hover:text-white">
        Log out <SignOut className="h-3 w-3" />
      </button>
    </div>
  ) : (
    <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-xs text-white/80 transition hover:text-white">
      <LogIn className="h-3 w-3" /> Log in
    </Link>
  )

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0d0d12] text-white">
        <div className="mx-auto flex h-8 w-[95%] xl:w-[85%] items-center justify-between">
          <p className="text-[0.68rem] text-white/70" suppressHydrationWarning>{today}</p>
          <div className="flex items-center gap-4">
            <a href="https://x.com/JoshuaK22038" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white/70 transition hover:text-white">
              <Twitter className="h-3 w-3" />
            </a>
            <span className="h-3 w-px bg-white/20" />
            {authControls}
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[#8f0a1e] via-crimson to-[#8f0a1e]">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_28px,rgba(0,0,0,0.07)_28px_56px)]" />
        <div className="relative mx-auto flex w-[95%] xl:w-[85%] items-center justify-between gap-6 py-6">
          <Link href="/" aria-label="The O-Post home" className="block flex-shrink-0 overflow-hidden bg-white shadow-md">
            <img src="/logo.png" alt="The O-Post" className="h-14 w-auto sm:h-20 md:h-24" />
          </Link>
          <div className="hidden text-right text-white md:block">
            <p className="font-serif text-3xl font-bold leading-tight lg:text-4xl">Accurate and Realistic</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/75">News · Politics · Business · Sports · Culture</p>
          </div>
        </div>
      </header>

      {/* Section navigation (sticky) */}
      <nav aria-label="Sections" className="sticky top-0 z-50 bg-[#16161d] text-white shadow-md">
        <div className="mx-auto flex w-[95%] xl:w-[85%] items-stretch justify-between">
          <ul className="no-scrollbar hidden items-stretch overflow-x-auto lg:flex">
            <li>
              <Link
                href="/"
                className={cn(
                  "flex h-12 items-center whitespace-nowrap px-4 text-[0.68rem] font-bold uppercase tracking-wider transition hover:bg-crimson",
                  pathname === "/" ? "bg-crimson" : "",
                )}
              >
                Home
              </Link>
            </li>
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={`/category/${link.href}`}
                  className={cn(
                    "flex h-12 items-center whitespace-nowrap px-3.5 text-[0.68rem] font-bold uppercase tracking-wider transition hover:bg-crimson",
                    activeSlug === link.href ? "bg-crimson" : "",
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className="inline-flex h-12 items-center gap-2 text-xs font-bold uppercase tracking-wider lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} Menu
          </button>

          <Link
            href="/#newsletter"
            className="my-1.5 inline-flex items-center bg-crimson px-4 text-[0.68rem] font-bold uppercase tracking-wider transition hover:bg-white hover:text-crimson"
          >
            Subscribe
          </Link>
        </div>

        {mobileMenuOpen && (
          <div className="fade-in border-t border-white/10 bg-[#16161d] lg:hidden">
            <ul className="mx-auto grid w-[95%] xl:w-[85%] grid-cols-2 sm:grid-cols-3">
              {links.map((link) => (
                <li key={link.name} className="border-b border-white/10">
                  <Link
                    href={`/category/${link.href}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold transition hover:bg-crimson"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}
