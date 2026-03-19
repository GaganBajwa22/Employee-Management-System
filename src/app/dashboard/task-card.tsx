"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { updateTaskStatus } from "./actions"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description?: string
  status: string
  due_date?: string
  created_at: string
}

export function TaskCard({ task }: { task: Task }) {
  const [status, setStatus] = useState(task.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    setIsUpdating(true)
    const result = await updateTaskStatus(task.id, newStatus)
    
    if (result?.error) {
      toast.error(result.error)
      // Revert if error
      setStatus(task.status)
    } else {
      setStatus(newStatus)
      toast.success("Task status updated")
    }
    setIsUpdating(false)
  }

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
    <div className="flex flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex justify-between items-start gap-2 mb-3">
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize flex gap-1.5 items-center">
          {getStatusIcon(status)}
          {status.replace('_', ' ')}
        </Badge>
        
        <Select 
          value={status} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs" disabled={isUpdating}>
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <h3 className="font-semibold text-lg line-clamp-2 mb-2">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {task.description}
        </p>
      )}
      
      <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-xs">
        <div className="flex flex-col text-muted-foreground">
          <span>Assigned to you</span>
        </div>
        {task.due_date && (
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">Due</span>
            <span className={`font-medium ${new Date(task.due_date) < new Date() && status !== 'completed' ? 'text-destructive' : ''}`}>
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
