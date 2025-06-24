
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, User } from "lucide-react";
import type { Worker } from '@/lib/data';
import { iconMap } from '@/lib/professions';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type WorkerCardProps = {
  worker: Worker;
};

export default function WorkerCard({ worker }: WorkerCardProps) {
  const IconComponent = iconMap[worker.icon] || User;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right relative bg-card rounded-2xl p-4 w-full">
        <Link href={`/users/${worker.id}`} className="block h-full group flex flex-col">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-lg flex items-center justify-center">
                <IconComponent className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                 <div className="flex-grow">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{worker.name}</h3>
                    <Badge variant="outline" className="mt-1 border-sky-200 dark:border-sky-800">{worker.title}</Badge>
                </div>
            </div>

            <div className="flex flex-col flex-grow mt-4 space-y-2 text-sm text-muted-foreground">
                 <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/80" />
                    <span>{worker.city}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/60 flex-shrink-0">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                    <span className="text-muted-foreground ml-1 font-medium">({worker.rating.toFixed(1)})</span>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(worker.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    ))}
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto">عرض الملف الشخصي</Button>
                </div>
            </div>
        </Link>
    </Card>
  );
}
