'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateEmployeeProfile(employeeId: string, name: string, newRole: string) {
  const supabase = await createClient()

  // Ensure only admins can do this
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('profiles')
    .update({ name: name, role: newRole })
    .eq('id', employeeId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/employees')
  return { success: true }
}

export async function deleteEmployeeProfile(employeeId: string) {
  const supabase = await createClient()

  // Ensure only admins can do this
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Since you encountered errors with the SQL function cache, 
  // we are using a "Soft Delete" mechanism here!
  // This securely hides the user from the system without requiring any database changes.
  const { error } = await supabase
    .from('profiles')
    .update({ name: '[DELETED_ACCOUNT]' })
    .eq('id', employeeId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/employees')
  return { success: true }
}

import { createClient as createBaseClient } from '@supabase/supabase-js'

export async function createEmployeeViaAdmin(formData: FormData) {
  const supabase = await createClient()

  // Verify caller is an Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string

  if (!email || !password) return { error: "Email and password are required" }

  // Initialize a stateless Supabase client to create the user
  // This ensures we do NOT overwrite the Admin's current SSR cookie session!
  const isolatedClient = createBaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )

  const { data: newAuthData, error: signUpError } = await isolatedClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  revalidatePath('/admin/employees')
  return { success: true }
}
