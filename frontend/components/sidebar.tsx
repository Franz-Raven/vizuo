"use client"

import { Moon, Sun, Bell, HelpCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { navItems } from "@/types/navigation"
import IconCell from "@/components/ui/icon-cell"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open")
    const startOpen = saved ? saved === "1" : true
    const isMobile = window.innerWidth < 640

    if (isMobile) {
      setOpen(false)
      document.documentElement.style.setProperty("--sidebar-width", "0rem")
    } else {
      setOpen(startOpen)
      document.documentElement.style.setProperty(
        "--sidebar-width",
        startOpen ? "14.5rem" : "4rem"
      )
    }
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  useEffect(() => {
    const isMobile = window.innerWidth < 640

    if (isMobile) {
      document.documentElement.style.setProperty("--sidebar-width", "0rem")
      return
    }

    localStorage.setItem("sidebar-open", open ? "1" : "0")
    document.documentElement.style.setProperty("--sidebar-width", open ? "14.5rem" : "4rem")
  }, [open])

  function go(href: string) {
    router.push(href)
  }

  function toggleTheme() {
    const root = document.documentElement
    const next = !root.classList.contains("dark")
    root.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
    setIsDark(next)
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen bg-background border-r border-border
        transition-all duration-200 ease-in-out
        ${open ? "w-58" : "w-16"} 
        hidden sm:block
      `}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col justify-between overflow-hidden">
        <div>
          <div className="mt-4 space-y-2 px-2 grid items-center grid-cols-[40px_1fr]">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`
                ${open ? "w-full" : "w-[40px]"} h-10 rounded-xl  
                justify-items-start hover:bg-muted 
                transition-all duration-200 ease-in-out`}
              aria-label="Toggle sidebar"
            >
              <span className={`h-10 w-10 flex items-center justify-center`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="2" />
                  <rect x="14" y="3" width="7" height="7" rx="2" />
                  <rect x="3" y="14" width="7" height="7" rx="2" />
                  <rect x="14" y="14" width="7" height="7" rx="2" />
                </svg>
              </span>
            </button>
            <span
              className={`mb-2 text-sm font-medium whitespace-nowrap overflow-hidden text-left transition-all duration-200 ease-in-out
              ${open ? "opacity-100 ml-3 max-w-[160px]" : "opacity-0 ml-0 max-w-0 pointer-events-none"}`}
              aria-hidden={!open}
            >
              Vizuo
            </span>
          </div>

          <nav className="mt-4 space-y-2 px-2">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href)
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => go(item.href)}
                  className={`
                    ${open ? "w-full" : "w-[40px]"} h-10 rounded-xl grid items-center grid-cols-[40px_1fr] justify-items-start 
                    transition-all duration-200 ease-in-out
                    ${active ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <IconCell Icon={Icon} />
                  <span
                    className={`text-sm font-medium whitespace-nowrap overflow-hidden text-left transition-all duration-200 ease-in-out
                      ${open ? "opacity-100 ml-3 max-w-[160px]" : "opacity-0 ml-0 max-w-0 pointer-events-none"}`}
                    aria-hidden={!open}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className={`pb-3 px-2 flex gap-2 ${open ? "flex-row" : "flex-col items-center"}`}>
          <button
            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200"
            aria-label="Help"
            title="About / Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <button
            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
