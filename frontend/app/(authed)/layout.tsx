import type React from "react"
import Sidebar from "@/components/sidebar"

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="ml-0 sm:ml-[var(--sidebar-width)]">
        {children}
      </div>
    </div>
  )
}
