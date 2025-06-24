"use client"

import { Handshake, Moon } from "lucide-react";

export default function HomeHeader() {

  // Dummy dark mode toggle for visual representation
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-primary p-4 text-primary-foreground rounded-b-3xl z-10 relative">
      <div className="flex items-center justify-between">
        <button onClick={toggleDarkMode} className="flex items-center justify-center h-10 w-10 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <Moon className="h-6 w-6 text-primary-foreground" />
        </button>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-headline">Zafay</h1>
            <div className="logo-icon p-1 bg-white rounded-md">
                <Handshake className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-primary-foreground/80 mt-1">منصة الربط بين العمال وأصحاب العمل</p>
        </div>
      </div>
    </header>
  );
}
