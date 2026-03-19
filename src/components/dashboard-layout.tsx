import * as React from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

interface DashboardLayoutProps {
  children: React.ReactNode
  role?: "admin" | "employee"
}

export function DashboardLayout({ children, role = "employee" }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
