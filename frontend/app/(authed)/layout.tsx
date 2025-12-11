"use client"

import type React from "react"
import Sidebar from "@/components/sidebar"
import "../globals.css"
import ToasterProvider from "@/components/toaster"
import { AuthProvider } from "@/context/auth-context"

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="ml-0 sm:ml-[var(--sidebar-width)]">
          {children}
        </div>
        <ToasterProvider />
      </div>
    </AuthProvider>
  )
}
