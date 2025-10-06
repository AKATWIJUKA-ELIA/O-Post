"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Search,LogOut as SignOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import { Id } from "../../convex/_generated/dataModel"
import { UserProfile } from "@/lib/types"
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
export  function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
        const [user, setUser] = useState<UserProfile|null>(null);
        const pathname = usePathname();
        const {LogOut} = useLogout();

         if(pathname.includes("admin") ){
                        return null
                }

useEffect(() => {
        (async () => {
                const { success, session } = await useUser();
                if (success && session) {
                        setUser({
                                userId: session.userId as Id<"users">,
                                role: session.role as string,
                                isVerified: session.isVerified as boolean,
                                expiresAt: session.expiresAt as Date,
                        });
                        return;
                }
                setUser(null);

        })();
        
}, []);

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

const handleLogout = async () => {
        await LogOut().then((data)=>{
                if(data?.success){
                        setUser(null);
                }

        });
}


  return (
    <>
    <header className={` ${sticky ? 'fade-in fixed top-2 left-0 right-0 z-50 shadow-md backdrop-blur-2xl ' : 'w-full'} w-full border-b border-border bg-blue backdrop-blur-2xl ` }>
      <div className="flex px-4 ">
        <div className="flex h-24 items-center lg:justify-between space-x-4 mx-auto w-full max-w-7xl">
          {/* Logo */}
          <div className="flex h-full   bg-white">
            <a href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-14 w-48" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {links.slice(0,9).map((link) => (
                <Link href={`/category/${link.href}`} key={link.name} className="text-sm font-medium text-foreground hover:text-secondary transition-colors">
                  <Button  size="sm" className="rounded-lg hover:cursor-pointer bg-red " >
                        {link.name}
                  </Button>
                </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className=" p-4 rounded-full border-white  text-white font-bold hover:cursor-pointer hover:bg-red">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            {user?.userId ? (
               <>
                <Link href="/profile">
            <Button className="hidden sm:inline-flex bg-whitee rounded-full  border-white  text-white font-bold hover:cursor-pointer hover:bg-red">Profile</Button>
            </Link>
        <Button onClick={()=>{handleLogout()}} className=" hidden md:flex bg-red hover:bg-red-900 hover:cursor-pointer w-14 rounded-2xl  " aria-label="logout" >
                <SignOut className="w-14" />
            </Button>    
               </>
        ):(
                <>
                <Link href="/sign-in">
            <Button className="hidden sm:inline-flex  rounded-full bg-transparent border-white  text-white font-bold hover:cursor-pointer hover:bg-red">Log in</Button>
            </Link>
            
            </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden bg-red"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        
      </div>
    </header>
    {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="grid grid-cols-4 fade-in fixed top-28 p-4 right-0 z-50 bg-blue/80 md:hidden py-4 space-y-4 border-t border-border">
            {links.map((link) => (
                  <Link href={link.href} key={link.name} className="text-sm font-medium text-foreground hover:text-secondary transition-colors">
                  <Button  size="sm" className="rounded-lg hover:cursor-pointer bg-red " >
                        {link.name}
                  </Button>
                </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button className="w-full bg-blue rounded-2xl  ">Log In</Button>
            </div>
          </div>
        )}
    </>
    )}
