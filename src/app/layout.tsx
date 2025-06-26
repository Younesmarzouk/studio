
import './globals.css';
import * as React from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/theme-provider';
import MainNav from '@/components/main-nav';

export const metadata: Metadata = {
  title: {
    template: '%s | ZafayLink',
    default: 'ZafayLink - منصة الربط بين العمال وأصحاب العمل',
  },
  description: 'منصة ZafayLink هي وجهتك الأولى للبحث عن عروض عمل أو العثور على عمال وحرفيين محترفين في جميع المجالات والمدن. انضم إلينا الآن.',
  openGraph: {
    title: 'ZafayLink - منصة الربط بين العمال وأصحاب العمل',
    description: 'تصفح آلاف الفرص، واعثر على أفضل الكفاءات لإنجاز أعمالك بسهولة.',
    url: 'https://zafay.link', // Replace with your actual domain
    siteName: 'ZafayLink',
    images: [
      {
        url: 'https://zafay.link/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ar_MA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZafayLink - منصة الربط بين العمال وأصحاب العمل',
    description: 'تصفح آلاف الفرص، واعثر على أفضل الكفاءات لإنجاز أعمالك بسهولة.',
    // siteId: 'your-twitter-site-id',
    // creator: '@your-twitter-handle',
    // creatorId: 'your-twitter-creator-id',
    images: ['https://zafay.link/og-image.png'], // Replace with your actual OG image URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
              <main className="flex-1 pt-16">{children}</main>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
