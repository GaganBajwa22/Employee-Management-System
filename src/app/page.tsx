"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-border/40 bg-background/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
            <Building2 size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight">EMS</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl space-y-8"
        >
          {/* <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            🎉 <span className="ml-2 border-l border-border/50 pl-2 text-muted-foreground">Version 1.0 is now live</span>
          </div> */}
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">
            Modernize your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Workforce Management
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground">
            A premium, high-performance platform to govern your administrative processes, track employee tasks, and overview analytics effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all gap-2 group">
                Access Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Abstract UI Preview Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-16 w-full max-w-5xl rounded-xl border border-border/50 bg-background/50 p-2 shadow-2xl backdrop-blur-sm"
        >
          <div className="rounded-lg border border-border/50 bg-card overflow-hidden h-[300px] md:h-[400px] relative flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
             <div className="w-full h-full opacity-30 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
             <p className="absolute text-muted-foreground font-medium flex items-center gap-2">
               <Building2 className="h-5 w-5" />
               EMS Dashboard Preview
             </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
