import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { CreateTaskDialog } from "./create-task-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import { deleteTask } from "./actions"

export default async function AdminTasksPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch tasks with assigned employee details
  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      *,
      assigned:profiles!tasks_assigned_to_fkey(name, email)
    `)
    .order("created_at", { ascending: false })

  // Fetch employees for the assign dialog
  const { data: employees } = await supabase
    .from("profiles")
    .select("id, name, email")
    .eq("role", "employee")
    .order("name")

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />
      default: return <AlertCircle className="w-4 h-4 text-amber-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'completed': return "secondary"
      case 'in_progress': return "default"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground mt-2">
            Manage all company tasks and track progress.
          </p>
        </div>
        <CreateTaskDialog employees={employees || []} />
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {tasks?.length ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start gap-2 mb-3">
                <Badge variant={getStatusBadgeVariant(task.status)} className="capitalize flex gap-1.5 items-center">
                  {getStatusIcon(task.status)}
                  {task.status.replace('_', ' ')}
                </Badge>
                
                <form action={async () => {
                  "use server"
                  await deleteTask(task.id)
                }}>
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              <h3 className="font-semibold text-lg line-clamp-1 mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {task.description}
                </p>
              )}
              
              <div className="mt-auto pt-4 border-t border-border/50 text-sm flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Assignee</span>
                  <span className="font-medium truncate max-w-[120px]">
                    {task.assigned?.name || task.assigned?.email || "Unassigned"}
                  </span>
                </div>
                {task.due_date && (
                  <div className="flex flex-col items-end text-xs">
                    <span className="text-muted-foreground">Due</span>
                    <span className="font-medium">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border rounded-xl border-dashed">
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground mt-1 text-sm">Create a new task to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
