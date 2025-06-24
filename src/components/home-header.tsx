
"use client"

import { Handshake } from "lucide-react";

export default function HomeHeader() {
  return (
    <header className="bg-background p-4 sticky top-0 z-20 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          {/* Can add a burger menu icon here in the future */}
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-headline">Zafay</h1>
          <div className="logo-icon p-1 bg-primary rounded-md">
              <Handshake className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
