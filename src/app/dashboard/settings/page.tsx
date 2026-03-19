import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { BadgeCheck, Mail, KeyRound, Palette } from "lucide-react"

export default async function EmployeeSettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage your account preferences and personal profile.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <section className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-border/50">
            <Avatar className="h-24 w-24 border-2 border-blue-500/20 shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-300 text-3xl font-bold uppercase">
                {profile?.name?.[0] || profile?.email?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{profile?.name || "No Name Provided"}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {profile?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium mt-2 capitalize">
                <BadgeCheck className="h-4 w-4" />
                {profile?.role} Account
              </div>
            </div>
          </div>
          <div className="bg-muted/20 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Member since {new Date(profile?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-500" />
              Appearance & Theming
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Customize how the EMS platform looks on your device.
            </p>
          </div>
          <div className="p-6 flex items-center justify-between bg-muted/20">
            <div className="space-y-1">
              <p className="font-medium">Interface Theme</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark modes.</p>
            </div>
            <ModeToggle />
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-500" />
              Security
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Authentication details are managed securely by Supabase.
            </p>
          </div>
          <div className="p-6 bg-muted/20 space-y-4">
            <div className="bg-card border border-border/50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Account Password</p>
                <p className="text-xs text-muted-foreground mt-1">Contact your Administrator if you need a password reset.</p>
              </div>
              <div className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                Managed
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
