import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { TaskCard } from "./task-card"

export default async function EmployeeDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single()

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("assigned_to", user.id)
    .order("created_at", { ascending: false })

  const pendingCount = tasks?.filter(t => t.status === 'pending').length || 0
  const inProgressCount = tasks?.filter(t => t.status === 'in_progress').length || 0
  const completedCount = tasks?.filter(t => t.status === 'completed').length || 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Good day, {profile?.name || "Employee"}!</h2>
        <p className="text-muted-foreground mt-2">
          Here is the list of tasks assigned to you.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-border/50 bg-card/50 p-4 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-amber-500 mb-1">{pendingCount}</span>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending</span>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-4 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-blue-500 mb-1">{inProgressCount}</span>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">In Progress</span>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-4 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-emerald-500 mb-1">{completedCount}</span>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.length ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center border rounded-xl border-dashed">
            <h3 className="text-lg font-medium">You have no assigned tasks.</h3>
            <p className="text-muted-foreground mt-1 text-sm">Relax for now or ask your administrator for new assignments.</p>
          </div>
        )}
      </div>
    </div>
  )
}
