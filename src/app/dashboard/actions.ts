'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('assigned_to', user.id) // Ensure security: can only update own tasks unless Admin (checked via RLS)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
