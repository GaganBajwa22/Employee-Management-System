'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createTask(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const assigned_to = formData.get('assigned_to') as string
  const due_date = formData.get('due_date') as string

  if (!title || !assigned_to) {
    return { error: "Title and Assignee are required" }
  }

  const { error } = await supabase.from('tasks').insert({
    title,
    description,
    assigned_to,
    due_date: due_date ? new Date(due_date).toISOString() : null,
    created_by: user.id
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/tasks')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/tasks')
  revalidatePath('/admin')
  return { success: true }
}
