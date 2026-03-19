"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Users, CheckSquare, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/app/login/actions"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "admin" | "employee"
}

export function Sidebar({ className, role = "employee", ...props }: SidebarProps) {
  const pathname = usePathname()

  const adminNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "All Tasks", href: "/admin/tasks", icon: CheckSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]
  
  const employeeNavItems = [
    { name: "My Tasks", href: "/dashboard", icon: CheckSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const navItems = role === "admin" ? adminNavItems : employeeNavItems

  return (
    <div className={cn("hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm h-screen sticky top-0 px-4 py-6", className)} {...props}>
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="h-8 w-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
          <Users size={16} />
        </div>
        <span className="font-bold text-lg tracking-tight">EMS Platform</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`) && item.href !== "/admin" && item.href !== "/dashboard"
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary/70" : "opacity-70 group-hover:opacity-100")} />
                {item.name}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t px-2">
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50">
            <LogOut className="h-4 w-4 opacity-70" />
            Log out
          </button>
        </form>
      </div>
    </div>
  )
}
