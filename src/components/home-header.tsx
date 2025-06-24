"use client"

import { Handshake, LogIn, LogOut } from "lucide-react";
import Link from 'next/link';
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

export default function HomeHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "تم تسجيل الخروج بنجاح." });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: "حدث خطأ أثناء تسجيل الخروج.", description: "يرجى المحاولة مرة أخرى." });
    }
  };

  const renderAuthButton = () => {
    if (loading) {
      return <Skeleton className="h-10 w-24" />;
    }

    if (user) {
      return (
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="ml-2 h-4 w-4" />
          خروج
        </Button>
      );
    }

    return (
      <Link href="/login" passHref>
        <Button variant="secondary">
          <LogIn className="ml-2 h-4 w-4" />
          دخول
        </Button>
      </Link>
    );
  };

  return (
    <header className="bg-primary p-4 shadow-lg text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="logo-icon p-2 bg-background rounded-lg">
            <Handshake className="h-8 w-8 text-primary" />
          </div>
          <div className="logo-text">
            <h1 className="text-xl font-bold font-headline">ZafayLink</h1>
            <p className="text-xs text-background/80">منصة الربط بين العمال وأصحاب العمل</p>
          </div>
        </div>
        {renderAuthButton()}
      </div>
    </header>
  );
}
