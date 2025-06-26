
"use client"

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Handshake, Menu, X, Sun, Moon, Briefcase, Users, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-provider';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';

const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/jobs', label: 'عروض العمل' },
    { href: '/workers', label: 'الباحثون عن عمل' },
];

export default function MainNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const { theme, setTheme } = useTheme();
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/');
    };

    const UserMenu = () => {
        if (loading) {
            return <Skeleton className="h-10 w-10 rounded-full" />;
        }
        if (user) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.photoURL || `https://api.dicebear.com/8.x/adventurer/svg?seed=${user.email}`} alt={user.displayName || 'User'} />
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName || "مستخدم"}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => router.push('/account')}>الحساب</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push('/settings')}>الإعدادات</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                            تسجيل الخروج
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        return (
            <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" asChild><Link href="/login">تسجيل الدخول</Link></Button>
                <Button asChild><Link href="/register">إنشاء حساب</Link></Button>
            </div>
        );
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                        <Handshake className="h-7 w-7" />
                        <span>ZafayLink</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-4">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild className="hidden md:flex">
                        <Link href="/post">
                            <PlusSquare className="ml-2 h-4 w-4" />
                            أضف إعلان
                        </Link>
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-full"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <UserMenu />
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]" dir="rtl">
                            <div className="p-4">
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map(link => (
                                        <Link 
                                            key={link.href} 
                                            href={link.href}
                                            onClick={() => setIsSheetOpen(false)}
                                            className={cn(
                                                "text-lg font-medium transition-colors hover:text-primary",
                                                pathname === link.href ? "text-primary" : "text-foreground"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="mt-6 pt-6 border-t">
                                    <Button asChild className="w-full mb-4">
                                        <Link href="/post" onClick={() => setIsSheetOpen(false)}>
                                            <PlusSquare className="ml-2 h-4 w-4" />
                                            أضف إعلان
                                        </Link>
                                    </Button>
                                    {!user && !loading && (
                                        <div className="flex flex-col gap-3">
                                            <Button variant="outline" asChild className="w-full">
                                                <Link href="/login" onClick={() => setIsSheetOpen(false)}>تسجيل الدخول</Link>
                                            </Button>
                                            <Button asChild className="w-full">
                                                <Link href="/register" onClick={() => setIsSheetOpen(false)}>إنشاء حساب</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
