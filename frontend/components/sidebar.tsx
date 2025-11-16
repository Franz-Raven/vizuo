"use client"

import { Home, Palette, Users, MessageSquare, Moon, Sun, Bell, HelpCircle } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type Item = { key: string; label: string; href: string; icon: React.ElementType }

const IconCell = React.memo(function IconCell({ Icon }: { Icon: React.ElementType }) {
  return (
    <span className={`h-10 w-10 flex items-center justify-center ml-[-0.01rem]`}>
      <Icon className="h-5 w-5" />
    </span>
  )
})

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open")
    setOpen(saved ? saved === "1" : true)
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-open", open ? "1" : "0")
  }, [open])

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open")
    const startOpen = saved ? saved === "1" : true
    setOpen(startOpen)
    setIsDark(document.documentElement.classList.contains("dark"))
    document.documentElement.style.setProperty("--sidebar-width", startOpen ? "14.5rem" : "4rem")
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar-open", open ? "1" : "0")
    document.documentElement.style.setProperty("--sidebar-width", open ? "14.5rem" : "4rem")
  }, [open])

  const items: Item[] = useMemo(
    () => [
      { key: "home", label: "Home", href: "/home", icon: Home },
      { key: "moodboard", label: "Moodboard", href: "/moodboard", icon: Palette },
      { key: "community", label: "Community", href: "/community", icon: Users },
      { key: "messages", label: "Messages", href: "/messages", icon: MessageSquare },
    ],
    []
  )

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
      className={`fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "w-58" : "w-16"
        }`}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col justify-between overflow-hidden">
        <div>
          <div className="mt-4 space-y-2 px-2">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`${open ? "w-full" : "w-[40px]"} h-10 rounded-xl grid items-center grid-cols-[40px_1fr] justify-center hover:bg-muted`}
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
              <span
                className={`text-sm font-medium whitespace-nowrap overflow-hidden text-left
                      ${open ? "opacity-100 ml-3 max-w-full" : "opacity-0 ml-0 max-w-0 pointer-events-none"}`}
                aria-hidden={!open}
              >
                Vizuo
              </span>
            </button>
          </div>

          <nav className="mt-4 space-y-2 px-2">
            {items.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href)
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => go(item.href)}
                  className={`${open ? "w-full" : "w-[40px]"} h-10 rounded-xl grid items-center grid-cols-[40px_1fr] justify-items-start
                    ${active ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <IconCell Icon={Icon} />
                  <span
                    className={`text-sm font-medium whitespace-nowrap overflow-hidden text-left
                      ${open ? "opacity-100 ml-3 max-w-full" : "opacity-0 ml-0 max-w-0 pointer-events-none"}`}
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
