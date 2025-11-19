import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/", "/landing", "/login", "/register"]

function isPublic(pathname: string) {
  return PUBLIC_PATHS.includes(pathname)
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value
  const pathname = req.nextUrl.pathname
  const isAuthenticated = !!token

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

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/public).*)"],
}
