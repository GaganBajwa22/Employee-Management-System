"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="employee">{children}</DashboardLayout>
}
