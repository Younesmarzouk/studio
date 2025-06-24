"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Settings, CircleUser, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/messages", label: "الرسائل", icon: MessageCircle },
  { href: "/account", label: "حسابي", icon: CircleUser },
  { href: "/settings", label: "الإعدادات", icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border/20 shadow-t-xl z-50">
      <div className="relative h-full">
        <nav className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
          {navItems.map((item, index) => (
             <React.Fragment key={item.href}>
                {/* Add a placeholder for the large central button */}
                {index === 2 && <div className="w-16 h-16" />}
                <Link href={item.href} className={cn(
                  "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors w-16",
                  pathname === item.href ? "text-primary" : "hover:text-primary"
                )}>
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
             </React.Fragment>
          ))}
        </nav>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
             <Link href="/post" passHref>
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg border-4 border-background cursor-pointer hover:bg-primary/90 transition-all">
                    <Plus className="h-8 w-8 text-primary-foreground" />
                </div>
             </Link>
        </div>
      </div>
    </div>
  )
}
