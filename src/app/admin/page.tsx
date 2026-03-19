import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Users } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch basic stats
  const { count: totalEmployees } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "employee")

  const { count: pendingTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .in("status", ["pending", "in_progress"])
    
  const { count: completedTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const stats = [
    {
      name: "Total Employees",
      value: totalEmployees || 0,
      icon: Users,
      description: "Active employees in the system",
    },
    {
      name: "Active Tasks",
      value: pendingTasks || 0,
      icon: Clock,
      description: "Tasks pending or in progress",
    },
    {
      name: "Completed Tasks",
      value: completedTasks || 0,
      icon: CheckCircle2,
      description: "Successfully finished tasks",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
        <p className="text-muted-foreground mt-2">
          Monitor your team&apos;s performance and manage tasks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4 border-border/50 shadow-sm bg-card/50 backdrop-blur-sm p-6 text-center text-muted-foreground">
          <p>Recent Tasks List (Will be implemented in next step)</p>
        </Card>
        <Card className="col-span-3 border-border/50 shadow-sm bg-card/50 backdrop-blur-sm p-6 text-center text-muted-foreground">
          <p>Employee Activity (Will be implemented in next step)</p>
        </Card>
      </div>
    </div>
  )
}
