"use client"

import * as React from "react"
import { Bell, Menu, Search } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md shadow-sm">
      <div className="flex flex-1 items-center gap-4 md:px-0">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="w-full max-w-sm hidden sm:block relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks, employees..."
            className="w-full bg-background pl-8 shadow-none appearance-none h-9 border-border/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/50 shadow-sm bg-background hidden sm:flex">
          <Bell className="h-4 w-4" />
          <span className="sr-only">View notifications</span>
        </Button>
        <ModeToggle />
        <div className="h-8 w-8 rounded-full bg-muted border border-border overflow-hidden">
          <Avatar className="h-full w-full">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="text-xs">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
