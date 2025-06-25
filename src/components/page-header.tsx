
import * as React from 'react';

type PageHeaderProps = {
  title: string;
  icon?: React.ReactNode;
};

export default function PageHeader({ title, icon }: PageHeaderProps) {
  return (
    <header className="bg-card p-4 shadow-md text-foreground sticky top-0 z-10 border-b">
      <div className="flex items-center justify-center gap-3 text-primary">
        {icon}
        <h1 className="text-xl font-bold font-headline">{title}</h1>
      </div>
    </header>
  );
}
