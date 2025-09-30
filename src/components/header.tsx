"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Menu, X, Search } from "lucide-react"
import Link from "next/link"
const links: { name: string; href: string }[] = [
        { name: "World", href: "#" },
        { name: "Politics", href: "#" },
        { name: "Business", href: "#" },
        { name: "Technology", href: "#" },
        { name: "Culture", href: "#" },
        { name: "Science", href: "#" },
        { name: "Health", href: "#" },
        { name: "Sports", href: "#" },
        { name: "Entertainment", href: "#" },
        { name: "Travel", href: "#" },
        { name: "Opinion", href: "#" },
        { name: "Lifestyle", href: "#" },
       { name: "Education", href: "#" },
]
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sticky, setSticky] = useState(false)


useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY >= 150) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  // Add listener
  window.addEventListener('scroll', handleScroll);

  // Run once on mount
  handleScroll();

  // Cleanup listener when unmounting
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);



  return (
    <header className={` ${sticky ? 'fade-in fixed top-2 z-50 shadow-md backdrop-blur-2xl ' : ''} w-full border-b border-border bg-blue backdrop-blur-2xl ` }>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center py-6 justify-between">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="font-serif text-5xl font-bold tracking-tight text-white">The O-Post</span>
            </a>
            <h1 className="flex font-semibold text-white " >
                Accurate and Realistic
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.slice(0,9).map((link) => (
                <Link href={link.href} key={link.name} className="text-sm font-medium text-foreground hover:text-secondary transition-colors">
                  <Button  size="sm" className="rounded-lg hover:cursor-pointer bg-red " >
                        {link.name}
                  </Button>
                </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex p-4 rounded-full border-white  text-white font-bold hover:cursor-pointer hover:bg-red">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button className="hidden sm:inline-flex bg-whitee rounded-full  border-white  text-white font-bold hover:cursor-pointer hover:bg-red">Log in</Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <a href="#" className="block text-base font-medium text-foreground hover:text-secondary">
              World
            </a>
            <a href="#" className="block text-base font-medium text-foreground hover:text-secondary">
              Politics
            </a>
            <a href="#" className="block text-base font-medium text-foreground hover:text-secondary">
              Business
            </a>
            <a href="#" className="block text-base font-medium text-foreground hover:text-secondary">
              Technology
            </a>
            <a href="#" className="block text-base font-medium text-foreground hover:text-secondary">
              Culture
            </a>
            <div className="pt-4 space-y-2">
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
