
import './globals.css';
import * as React from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/theme-provider';
import MainNav from '@/components/main-nav';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'ZafayLink',
  description: 'منصة ZafayLink هي وجهتك الأولى للبحث عن عروض عمل أو العثور على عمال وحرفيين محترفين في جميع المجالات والمدن. انضم إلينا الآن.',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
            <div className="relative flex min-h-screen flex-col bg-background">
              <MainNav />
              <main className="flex-1 pb-24 md:pb-0">{children}</main>
            </div>
            <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
