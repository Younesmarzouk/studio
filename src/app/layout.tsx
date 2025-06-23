import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'ZafayLink',
  description: 'منصة الربط بين العمال وأصحاب العمل',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="relative flex min-h-screen flex-col bg-background">
          <main className="flex-1 pb-24">{children}</main>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
