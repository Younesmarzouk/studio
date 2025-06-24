
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Star, MapPin, User } from "lucide-react";
import type { Worker } from '@/lib/data';
import { iconMap } from '@/lib/professions';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

type WorkerCardProps = {
  worker: Worker;
};

export default function WorkerCard({ worker }: WorkerCardProps) {
  const IconComponent = iconMap[worker.icon] || User;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right w-full bg-card rounded-2xl p-4">
      <Link href={`/users/${worker.id}`} className="block h-full group flex flex-col flex-grow">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-shrink-0 w-16 h-16 bg-sky-100 dark:bg-sky-900/50 rounded-xl flex items-center justify-center">
            <IconComponent className="h-8 w-8 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="flex-grow">
            <Badge variant="outline" className="mb-1 border-sky-200 dark:border-sky-800">{worker.title}</Badge>
            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{worker.name}</h3>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="flex-grow space-y-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">المدينة:</span>
                <span>{worker.city}</span>
            </div>
        </div>

        <div className="mt-auto pt-4 flex-shrink-0">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground ml-1 font-medium">({worker.rating.toFixed(1)})</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(worker.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
              عرض الملف الشخصي
            </div>

          </div>
        </div>
      </Link>
    </Card>
  );
}
