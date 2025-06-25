
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';

type PageHeaderProps = {
  title: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
};

const BackButton = () => {
    const router = useRouter();
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-white/20 md:left-4"
            aria-label="Go back"
        >
            <ChevronLeft className="h-6 w-6" />
        </Button>
    );
};

export default function PageHeader({ title, icon, showBackButton = false }: PageHeaderProps) {
  return (
    <header className="relative bg-primary text-primary-foreground p-4 pb-8 rounded-b-[2rem] shadow-lg">
      <div className="relative flex items-center justify-center gap-3 text-center">
        {showBackButton && <BackButton />}
        {icon}
        <h1 className="text-xl font-bold font-headline">{title}</h1>
      </div>
    </header>
  );
}
