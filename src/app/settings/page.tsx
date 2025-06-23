"use client"
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Bell, Globe, Moon, LogOut, ChevronRight, Paintbrush } from "lucide-react";
import Link from 'next/link';

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">الإعدادات</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الحساب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/settings/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer">
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
              <Switch id="dark-mode-switch" checked={darkMode} onCheckedChange={setDarkMode} />
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

        <Link href="/login" className="w-full">
          <Button variant="destructive" className="w-full">
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </Link>
      </div>
    </div>
  );
}
