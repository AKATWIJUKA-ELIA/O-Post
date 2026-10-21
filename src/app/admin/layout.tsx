"use client";
import { AppSidebar } from "@/adminComponents/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/convex";
import { useUser } from "@/hooks/useUser";
import { User, UserProfile } from "@/lib/types";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ExternalLink, LogOut as SignOut } from "lucide-react";
import useLogout from "@/hooks/useLogout"
import Link from "next/link";

const PAGE_TITLES: [string, string][] = [
  ["/admin/create", "Create post"],
  ["/admin/edit", "Edit post"],
  ["/admin/update", "Update post"],
  ["/admin/newsletter", "Newsletter"],
  ["/admin/subscribers", "Subscribers"],
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
        const [user, setUser] = useState<UserProfile|null>(null);
        const [Author, setAuthor] = useState<User|null>(null);
        const { LogOut } = useLogout()
        const pathname = usePathname()
        const pageTitle = PAGE_TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "Dashboard"
       useEffect(()=>{(async()=>{
               const{success,session}=await useUser();
               if(success&&session){
                       setUser({
                               userId:session.userId as Id<"users">,
                               role:session.role as string,
                               isVerified:session.isVerified as boolean,
                               expiresAt:session.expiresAt as Date,});
                               return;
                        }
                               setUser(null);})();},[]);

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
         
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-[#f4f4f6]">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">O-Post Admin</p>
            <h1 className="truncate text-base font-bold text-foreground sm:text-lg">{pageTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/" target="_blank">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View site
              </Link>
            </Button>
            <Link href="/profile" className="flex items-center gap-2 rounded-md px-1.5 py-1 transition hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={Author?.profilePicture || undefined} alt="Your avatar" />
                <AvatarFallback className="bg-crimson text-xs text-white">
                  {Author?.username ? Author.username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-semibold text-foreground md:inline">{Author?.username}</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => handleLogout()} aria-label="Log out" title="Log out">
              <SignOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
