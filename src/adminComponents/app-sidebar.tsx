"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/adminComponents/nav-main"
import { NavUser } from "@/adminComponents/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "../components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-crimson font-serif text-lg font-bold text-white">
            O
          </span>
          <span className="leading-tight group-data-[collapsible=icon]:hidden">
            <span className="block font-serif text-base font-bold text-white">The O-Post</span>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/50">Newsroom admin</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
