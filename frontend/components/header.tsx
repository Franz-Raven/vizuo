"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, HelpCircle, Moon, Sun, Bell, User, LayoutDashboard, LogOut } from "lucide-react"
import { getProfile } from "@/lib/api/profile"
import { logoutUser } from "@/lib/api/auth"
import { navItems } from "@/types/navigation"
import IconCell from "@/components/ui/icon-cell"
import PrimaryButton from "./ui/primary-button"

type HeaderUser = {
  username: string
  email: string
  avatar: string
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<HeaderUser | null>(null)
  const [open, setOpen] = useState(false) // profile dropdown
  const [navOpen, setNavOpen] = useState(false) // mobile drawer
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    let active = true
      ; (async () => {
        try {
          const res = await getProfile()
          if (!active || !res?.user) return
          setUser({
            username: res.user.username,
            email: res.user.email,
            avatar: res.user.avatar,
          })
        } catch (err) {
          console.error("Failed to load header user", err)
        }
      })()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggleDropdown = () => {
    setOpen((v) => !v)
  }

  const handleProfile = () => {
    setOpen(false)
    router.push("/profile")
  }

  const handleDashboard = () => {
    setOpen(false)
    router.push("/dashboard")
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.error("Failed to logout", err)
    } finally {
      setOpen(false)
      setUser(null)
      router.replace("/landing")
    }
  }

  const toggleTheme = () => {
    const root = document.documentElement
    const next = !root.classList.contains("dark")
    root.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
    setIsDark(next)
  }

  const go = (href: string) => {
    router.push(href)
    setNavOpen(false)
  }

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 z-30 flex h-16 items-center
          border-b border-border bg-background px-4 sm:px-6 backdrop-blur-xl
          transition-all duration-200 ease-in-out
          sm:left-[var(--sidebar-width)]
        "
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="ml-2 text-lg font-medium whitespace-nowrap">Vizuo</span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <PrimaryButton title="Subscriptions" />

            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center rounded-full p-0.5 hover:bg-muted transition-colors"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <div className="h-9 w-9 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-muted" />
                  )}
                </div>
              </button>

              {open && (
                <div
                  className="absolute right-0 p-2 mt-2 w-64 rounded-2xl border border-border bg-popover shadow-lg shadow-black/20"
                  role="menu"
                >
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-muted" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {user?.username ?? "Loading..."}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email ?? ""}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleProfile}
                      className="flex w-full items-center gap-2 my-2 px-4 py-2 rounded-md text-sm hover:bg-muted"
                      role="menuitem"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Profile</span>
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="flex w-full items-center gap-2 my-2 px-4 py-2 rounded-md text-sm hover:bg-muted"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </button>
                  </div>

                  <div className="border-t border-border">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 mt-2 px-4 py-2 text-sm font-semibold rounded-md text-red-500 hover:bg-muted"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {navOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
          />

          <aside
            className="
              absolute left-0 top-0 h-full w-[14.5rem]
              bg-background border-r border-border shadow-xl
              flex flex-col justify-between overflow-hidden
            "
            aria-label="Mobile navigation"
          >
            <div>
              <div className="mt-4 px-3 flex items-center justify-between">
                <span className="ml-2 text-lg font-medium whitespace-nowrap">Vizuo</span>
                <button
                  type="button"
                  onClick={() => setNavOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
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
                        w-full h-10 rounded-xl grid items-center grid-cols-[40px_1fr] justify-items-start 
                        transition-all duration-200 ease-in-out
                        ${active ? "bg-muted text-foreground" : "hover:bg-muted/50"}
                      `}
                      aria-current={active ? "page" : undefined}
                    >
                      <IconCell Icon={Icon} />
                      <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-left ml-3 max-w-[160px]">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="pb-3 px-2 flex flex-row gap-2">
              <button
                className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200"
                aria-label="Help"
                title="About / Help"
                type="button"
              >
                <HelpCircle className="h-5 w-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200"
                aria-label="Toggle theme"
                title="Toggle theme"
                type="button"
              >
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              <button
                className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200"
                aria-label="Notifications"
                title="Notifications"
                type="button"
              >
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
