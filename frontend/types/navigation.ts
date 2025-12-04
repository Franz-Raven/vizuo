import { Home, Palette, Users, MessageSquare, Upload } from "lucide-react"

export type NavItem = {
  key: string
  label: string
  href: string
  icon: React.ElementType
}

export const navItems: NavItem[] = [
  { key: "home", label: "Home", href: "/home", icon: Home },
  { key: "upload", label: "Upload", href: "/upload", icon: Upload },
  { key: "moodboard", label: "Moodboard", href: "/moodboard", icon: Palette },
  { key: "community", label: "Community", href: "/community", icon: Users },
  { key: "messages", label: "Messages", href: "/messaging", icon: MessageSquare },
]
