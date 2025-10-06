"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search, Signpost as SignOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import type { Id } from "../../convex/_generated/dataModel"
import type { UserProfile } from "@/lib/types"
import useLogout from "@/hooks/useLogout"

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
  const [sticky, setSticky] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)

useEffect(()=>{(async()=>{
        const{success,session}=await useUser();
        if(success&&session){
                setUser({
                        userId:session.userId as Id<"users">,
                        role:session.role as string,
                        isVerified:session.isVerified as boolean,
                        expiresAt:session.expiresAt as Date,});return;}setUser(null);})();},[]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 150) {
        setSticky(true)
      } else {
        setSticky(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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

  return (
    <>
      <header
        className={` ${
          sticky ? "fade-in fixed top-2 left-0 right-0 z-50 shadow-md backdrop-blur-2xl" : "w-full"
        } w-full border-b border-border bg-blue backdrop-blur-2xl`}
      >
        <div className="flex px-2 sm:px-4">
          <div className="flex h-16 sm:h-20 lg:h-24 items-center lg:justify-between space-x-2 sm:space-x-4 mx-auto w-full max-w-7xl">
            <div className="flex h-full bg-white/50">
              <a href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-10 w-32 sm:h-12 sm:w-40 lg:h-14 lg:w-48" />
              </a>
            </div>

            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              {links.slice(0, 9).map((link) => (
                <Link
                  href={`/category/${link.href}`}
                  key={link.name}
                  className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
                >
                  <Button size="sm" className="rounded-lg hover:cursor-pointer bg-red">
                    {link.name}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 sm:p-4 rounded-full border-white text-white font-bold hover:cursor-pointer hover:bg-red"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Search</span>
              </Button>
              {user?.userId ? (
                <>
                  <Link href="/profile">
                    <Button className="hidden sm:inline-flex bg-whitee rounded-full border-white text-white font-bold hover:cursor-pointer hover:bg-red">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout()
                    }}
                    className="hidden md:flex bg-red hover:bg-red-900 hover:cursor-pointer w-10 sm:w-14 rounded-2xl"
                    aria-label="logout"
                  >
                    <SignOut className="w-10 sm:w-14" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button className="hidden sm:inline-flex rounded-full bg-transparent border-white text-white font-bold hover:cursor-pointer hover:bg-red">
                      Log in
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden bg-red p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 fade-in fixed top-16 sm:top-20 lg:top-28 p-3 sm:p-4 left-0 right-0 z-50 bg-blue/95 backdrop-blur-md lg:hidden border-t border-border">
          {links.map((link) => (
            <Link
              href={`/category/${link.href}`}
              key={link.name}
              className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
            >
              <Button size="sm" className="w-full rounded-lg hover:cursor-pointer bg-red text-xs sm:text-sm">
                {link.name}
              </Button>
            </Link>
          ))}
          {!user?.userId && (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 pt-2">
              <Link href="/sign-in">
                <Button className="w-full bg-transparent border border-white rounded-2xl text-white hover:bg-red">
                  Log In
                </Button>
              </Link>
            </div>
          )}
          {user?.userId && (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 pt-2 flex gap-2">
              <Link href="/profile" className="flex-1">
                <Button className="w-full bg-transparent border border-white rounded-2xl text-white hover:bg-red">
                  Profile
                </Button>
              </Link>
              <Button
                onClick={() => {
                  handleLogout()
                }}
                className="flex-1 bg-red hover:bg-red-900 rounded-2xl"
                aria-label="logout"
              >
                <SignOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
