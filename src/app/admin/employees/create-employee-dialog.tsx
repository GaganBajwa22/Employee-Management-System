"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createEmployeeViaAdmin } from "./actions"

export function CreateEmployeeDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    const result = await createEmployeeViaAdmin(formData)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Employee created successfully!")
      setOpen(false)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-sm">
        <UserPlus className="h-4 w-4" />
        Register New Member
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Register a new team member instantly. Their profile will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit as any}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="E.g. John Doe" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" placeholder="john@company.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue="employee">
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
