
"use client"
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Bell, Globe, Moon, LogOut, ChevronRight, Paintbrush, Settings } from "lucide-react";
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import { useTheme } from '@/context/theme-provider';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({ title: 'تم تسجيل الخروج بنجاح.' });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'فشل تسجيل الخروج.' });
    }
  };

  return (
    <div>
      <PageHeader title="الإعدادات" icon={<Settings className="h-6 w-6" />} />
      <div className="p-4 max-w-2xl mx-auto">
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

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
        </div>
      </div>
    </div>
  );
}
