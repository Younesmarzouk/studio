
"use client"
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Bell, Globe, Moon, LogOut, ChevronRight, Paintbrush, Settings, LogIn } from "lucide-react";
import Link from 'next/link';
import { useTheme } from '@/context/theme-provider';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الإعدادات',
  description: 'إدارة إعدادات حسابك وتفضيلات التطبيق.',
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const [user, loading] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({ title: 'تم تسجيل الخروج بنجاح.' });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'فشل تسجيل الخروج.' });
    }
  };

  const renderAuthButton = () => {
    if (loading) {
      return <Skeleton className="h-10 w-full" />;
    }

    if (user) {
      return (
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      );
    }

    return (
      <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-primary-foreground">
        <Link href="/login">
          <LogIn className="ml-2 h-4 w-4" />
          تسجيل الدخول أو إنشاء حساب
        </Link>
      </Button>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><Settings className="h-8 w-8"/> الإعدادات</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/account" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>ملفــي الشخصــي</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">التطبيق</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="notifications-switch">الإشعارات</Label>
                </div>
                <Switch id="notifications-switch" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <Paintbrush className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="dark-mode-switch">الوضع الداكن</Label>
                </div>
                <Switch 
                  id="dark-mode-switch" 
                  checked={theme === 'dark'} 
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-4">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span>اللغة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">العربية</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {renderAuthButton()}

        </div>
      </div>
    </div>
  );
}
