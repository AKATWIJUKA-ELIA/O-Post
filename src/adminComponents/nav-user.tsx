"use client"

import Link from "next/link"
import { ExternalLink, LogOutIcon, MoreVerticalIcon, Newspaper, SquarePlus, UserCircleIcon, Users } from "lucide-react"

import useLogout from "@/hooks/useLogout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useAppSelector } from "@/hooks"

export function NavUser() {
  const { isMobile } = useSidebar()
  const User = useAppSelector((state) => state.user.user)
  const { LogOut } = useLogout()

  const avatar = (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={User?.profilePicture || undefined} alt={User?.Username} />
      <AvatarFallback className="rounded-lg bg-crimson text-white">{User?.Username?.charAt(0).toUpperCase() ?? "O"}</AvatarFallback>
    </Avatar>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* A native <button> so Radix gets a ref to anchor the menu (SidebarMenuButton doesn't forward refs on React 18) */}
          <DropdownMenuTrigger asChild>
            <button
              className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm text-white outline-none ring-sidebar-ring transition hover:bg-white/10 focus-visible:ring-2 data-[state=open]:bg-white/10 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
              aria-label="Account menu"
            >
              {avatar}
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">{User?.Username}</span>
                <span className="truncate text-xs text-white/50">{User?.email}</span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {avatar}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{User?.Username}</span>
                  <span className="truncate text-xs text-muted-foreground">{User?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">
                  <UserCircleIcon /> My account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/admin/create">
                  <SquarePlus /> Create post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/admin/newsletter">
                  <Newspaper /> Newsletter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/admin/subscribers">
                  <Users /> Subscribers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/" target="_blank">
                  <ExternalLink /> View website
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
              onClick={() => LogOut()}
            >
              <LogOutIcon /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
