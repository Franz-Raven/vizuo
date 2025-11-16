import type React from "react"
import Sidebar from "@/components/sidebar"
import "../globals.css"
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
            background: 'linear-gradient(135deg, #2A2A2A 0%, #3A3A3A 100%)',
            color: '#E7E7E7',
            border: '1px solid #404040',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            fontWeight: '500',
          },
        }}
      />
    </div>
  )
}