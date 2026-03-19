"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, ShieldAlert, Trash2, Edit2, Loader2, Save, X } from "lucide-react"
import { updateEmployeeProfile, deleteEmployeeProfile } from "./actions"
import { toast } from "sonner"

interface Employee {
  id: string
  name: string | null
  email: string
  role: string
  created_at: string
}

export function EmployeeRow({ employee }: { employee: Employee }) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [role, setRole] = useState(employee.role)
  const [name, setName] = useState(employee.name || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    const res = await updateEmployeeProfile(employee.id, name, role)
    if (res?.error) {
      toast.error(res.error)
      setRole(employee.role)
      setName(employee.name || "")
    } else {
      toast.success("Employee profile updated")
      setIsUpdateModalOpen(false)
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${employee.email}?`)) return
    
    setIsLoading(true)
    const res = await deleteEmployeeProfile(employee.id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Employee profile removed")
    }
    setIsLoading(false)
  }

  return (
    <>
      <TableRow className="hover:bg-muted/30 transition-colors group">
        <TableCell className="flex items-center gap-3 py-4">
          <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-300 font-semibold uppercase">
              {employee.name?.[0] || employee.email?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 max-w-[200px]">
            <span className="font-semibold">{employee.name || "Unknown User"}</span>
            <span className="text-xs text-muted-foreground">{employee.id.substring(0, 8)}...</span>
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">{employee.email}</TableCell>
        <TableCell>
          <Badge variant="secondary" className={`border-0 ${employee.role === 'admin' ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
            <span className="capitalize font-medium">{employee.role}</span>
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
          {new Date(employee.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Employee Profile</DialogTitle>
            <DialogDescription>
              Modify the profile details and access level for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={isLoading} 
                placeholder="Full Name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email address</Label>
              <Input id="edit-email" value={employee.email} disabled className="bg-muted cursor-not-allowed text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">Emails cannot be changed for active accounts.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role Access Level</Label>
              <Select value={role} onValueChange={(v) => v && setRole(v)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
