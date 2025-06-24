"use client" 

import './globals.css';
import * as React from 'react';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from '@/components/bottom-nav';
import { usePathname } from 'next/navigation';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBottomNav = !['/login', '/register'].includes(pathname);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>Zafay</title>
        <meta name="description" content="منصة الربط بين العمال وأصحاب العمل" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="relative flex min-h-screen flex-col bg-background">
          <main className={showBottomNav ? "flex-1 pb-24" : "flex-1"}>{children}</main>
          {showBottomNav && <BottomNav />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
