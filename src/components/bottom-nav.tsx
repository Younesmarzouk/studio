
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Settings, Briefcase, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/jobs", label: "الوظائف", icon: Briefcase },
  { href: "/post", label: "أضف إعلان", icon: Plus },
  { href: "/workers", label: "العمال", icon: Users },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border/20 shadow-t-xl z-50">
      <nav className="grid h-full grid-cols-5 items-center max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
          if (item.href === "/post") {
            return (
              <div key={item.href} className="flex justify-center items-center">
                <Link href="/post" passHref>
                  <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg border-4 border-background cursor-pointer hover:bg-primary/90 transition-all -translate-y-4">
                      <Plus className="h-8 w-8 text-primary-foreground" />
                  </div>
                </Link>
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors w-full h-full",
                isActive ? "text-primary" : "hover:text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  )
}
