
"use client"

import { Handshake, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-provider";

export default function HomeHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-primary text-primary-foreground p-4 pb-12 rounded-b-[3rem] shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
                <div className="logo-icon p-2 bg-white/20 rounded-lg">
                    <Handshake className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline">Zafay</h1>
                    <p className="text-sm opacity-90">منصة الربط بين العمال وأصحاب العمل</p>
                </div>
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full hover:bg-white/20"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
