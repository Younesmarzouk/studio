
"use client"

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
};

export default function PageHeader({ title, icon, showBackButton = false }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6 px-4 md:px-0">
      <div className="flex items-center gap-3">
        {icon}
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>
      {showBackButton && (
        <Button variant="outline" onClick={() => router.back()}>
           رجوع
          <ChevronLeft className="h-4 w-4 mr-2" />
        </Button>
      )}
    </div>
  );
}
