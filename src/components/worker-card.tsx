
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { MapPin, User } from "lucide-react";
import type { Worker } from '@/lib/data';
import { iconMap } from '@/lib/professions';

type WorkerCardProps = {
  worker: Worker;
};

export default function WorkerCard({ worker }: WorkerCardProps) {
  const IconComponent = iconMap[worker.icon] || User;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right w-full bg-card rounded-2xl p-4">
      <Link href={`/users/${worker.id}`} className="block h-full group flex flex-col flex-grow">
        <div className="flex-grow">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-sky-100 dark:bg-sky-900/50 rounded-xl flex items-center justify-center">
                    <IconComponent className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{worker.title}</p>
                    <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">{worker.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{worker.city}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-auto pt-4 flex-shrink-0">
          <div className="flex justify-end items-center text-sm">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
              عرض الملف الشخصي
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
