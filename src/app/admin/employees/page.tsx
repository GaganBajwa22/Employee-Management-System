export const dynamic = "force-dynamic"

import Link from "next/link"
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

export default async function AdminEmployeesPage(props: any) {
  const supabase = await createClient()

  // ✅ FIX 1: unwrap searchParams (IMPORTANT)
  const searchParams = await props.searchParams

  // AUTH CHECK
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // PAGINATION LOGIC
  const page = Number(searchParams?.page) || 1
  const limit = 4
  const from = (page - 1) * limit
  const to = from + limit - 1

  // FETCH PAGINATED DATA
  const { data: employees, count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .neq("name", "[DELETED_ACCOUNT]")
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error(error)
  }

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Team Members</h2>
        </div>
        <CreateEmployeeDialog />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
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
                <TableCell colSpan={5} className="text-center">
                  No team members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4">
        
        <Link
          href={`?page=${page - 1}`}
          className={`px-3 py-1 border rounded ${
            page === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Prev
        </Link>

        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={`?page=${i + 1}`}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </Link>
        ))}

        <Link
          href={`?page=${page + 1}`}
          className={`px-3 py-1 border rounded ${
            page === totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>

      </div>

    </div>
  )
}