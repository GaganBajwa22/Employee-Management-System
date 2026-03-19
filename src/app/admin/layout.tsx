"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <DashboardLayout role="admin">{children}</DashboardLayout>
}
