import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/", "/landing", "/login", "/register"]
const ADMIN_PATHS = ["/admin"]

function isPublic(pathname: string) {
  return PUBLIC_PATHS.includes(pathname)
}

function isAdminPath(pathname: string) {
  return ADMIN_PATHS.some((p) => pathname.startsWith(p))
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value
  const role = req.cookies.get("userRole")?.value
  const pathname = req.nextUrl.pathname

  const isAuthenticated = !!token
  const isAdmin = role === "admin"

  if (!isAuthenticated && !isPublic(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/landing"
    url.search = ""
    return NextResponse.redirect(url)
  }

  if (isAuthenticated && isPublic(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/home"
    url.search = ""
    return NextResponse.redirect(url)
  }

  if (isAdminPath(pathname) && !isAdmin) {
    const url = req.nextUrl.clone()
    url.pathname = "/home"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/public).*)"],
}
