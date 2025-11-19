"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProfile } from "@/lib/api/profile"
import { logoutUser } from "@/lib/api/auth"

type HeaderUser = {
  username: string
  email: string
  avatar: string
}

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<HeaderUser | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
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

  const toggleDropdown = () => {
    setOpen((v) => !v)
  }

  const handleProfile = () => {
    setOpen(false)
    router.push("/profile")
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

  return (
    <header className="fixed top-0 left-[var(--sidebar-width,3.5rem)] right-0 z-30 flex h-16 items-center justify-end border-b border-border bg-background px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">

        <button
          type="button"
          className="h-9 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Subscriptions
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex items-center rounded-full p-0.5 hover:bg-muted transition-colors"
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
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-popover shadow-lg shadow-black/20">
              <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted">
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

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user?.username ?? "Loading..."}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-muted"
                >
                  <span>Profile</span>
                </button>
              </div>

              <div className="border-t border-border/60">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-muted"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
