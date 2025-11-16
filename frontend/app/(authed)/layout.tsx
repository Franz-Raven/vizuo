import type React from "react"
import Sidebar from "@/components/sidebar"
import { Toaster } from "sonner"

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div style={{ marginLeft: "var(--sidebar-width, 4rem)" }}>{children}</div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  )
}