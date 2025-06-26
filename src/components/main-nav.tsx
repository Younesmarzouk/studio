
"use client"

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, PlusSquare, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function MainNav() {
    const pathname = usePathname();
    const [user] = useAuthState(auth);

    const navItems = [
        { href: '/', label: 'الرئيسية', icon: Home, auth: false },
        { href: '/messages', label: 'الرسائل', icon: MessageSquare, auth: true },
        { href: '/post', label: 'نشر إعلان', icon: PlusSquare, auth: true },
        { href: '/workers', label: 'الباحثون', icon: Users, auth: false },
        { href: '/settings', label: 'الإعدادات', icon: Settings, auth: false },
    ];

    return (
        <header className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
            <nav className="container mx-auto flex justify-around p-1">
                {navItems.map(item => {
                    if (item.auth && !user) return null;

                    return (
                        <Link key={item.href} href={item.href} className={cn(
                            'flex flex-col items-center gap-1 p-2 rounded-md text-muted-foreground transition-colors hover:text-primary hover:bg-accent w-20',
                            pathname === item.href && 'text-primary bg-accent'
                        )}>
                            <item.icon className="h-6 w-6" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
