import * as React from 'react';

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="bg-primary p-4 shadow-md text-primary-foreground sticky top-0 z-10">
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold font-headline">{title}</h1>
      </div>
    </header>
  );
}
