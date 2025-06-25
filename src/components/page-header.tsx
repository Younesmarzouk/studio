import * as React from 'react';

type PageHeaderProps = {
  title: string;
  icon?: React.ReactNode;
};

export default function PageHeader({ title, icon }: PageHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 pb-8 rounded-b-[2rem] shadow-lg">
      <div className="flex items-center justify-center gap-3">
        {icon}
        <h1 className="text-xl font-bold font-headline">{title}</h1>
      </div>
    </header>
  );
}
