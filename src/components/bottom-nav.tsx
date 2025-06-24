"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusSquare, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/post", label: "نشر إعلان", icon: PlusSquare },
  { href: "/account", label: "حسابي", icon: User },
  { href: "/settings", label: "الإعدادات", icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border shadow-t-lg z-50">
      <nav className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link href={item.href} key={item.href} className={cn(
              "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors w-20",
              isActive ? "text-primary" : "hover:text-foreground"
            )}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
