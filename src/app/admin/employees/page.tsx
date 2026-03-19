import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmployeeRow } from "./employee-row"
import { CreateEmployeeDialog } from "./create-employee-dialog"

export default async function AdminEmployeesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: employees } = await supabase
    .from("profiles")
    .select("*")
    .neq("name", "[DELETED_ACCOUNT]")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage your organization's members. Add, update roles, or remove profiles.
          </p>
        </div>
        <CreateEmployeeDialog />
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Employee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.length ? (
              employees.map((emp) => (
                <EmployeeRow key={emp.id} employee={emp} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No team members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
    </div>
  )
}
