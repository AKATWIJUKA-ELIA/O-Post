"use client"

import { type LucideIcon, LayoutDashboardIcon, SquarePlus, Newspaper, Globe, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = { title: string; icon: LucideIcon; link: string }

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", icon: LayoutDashboardIcon, link: "/admin" }],
  },
  {
    label: "Content",
    items: [
      { title: "Create Post", icon: SquarePlus, link: "/admin/create" },
      { title: "Newsletter", icon: Newspaper, link: "/admin/newsletter" },
      { title: "Subscribers", icon: Users, link: "/admin/subscribers" },
    ],
  },
  {
    label: "Site",
    items: [{ title: "View website", icon: Globe, link: "/" }],
  },
]

export function NavMain() {
  const pathname = usePathname()
  const isActive = (link: string) => (link === "/admin" ? pathname === "/admin" : link !== "/" && pathname.startsWith(link))

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/40">
            {group.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.link)}
                    className="h-10 rounded-md text-white/75 transition hover:bg-white/10 hover:text-white data-[active=true]:bg-crimson data-[active=true]:font-semibold data-[active=true]:text-white data-[active=true]:shadow-md"
                  >
                    <Link href={item.link}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
