
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Star, MapPin, User } from "lucide-react";
import type { Worker } from '@/lib/data';
import { iconMap } from '@/lib/professions';

type WorkerCardProps = {
  worker: Worker;
};

export default function WorkerCard({ worker }: WorkerCardProps) {
  const IconComponent = iconMap[worker.icon] || User;

  return (
    <Link href={`/users/${worker.id}`} className="block h-full group">
      <Card className="overflow-hidden shadow-md group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col p-4 text-left relative bg-card rounded-2xl">
        
        <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
          <IconComponent className="h-6 w-6 text-sky-600" />
        </div>

        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-foreground">{worker.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 flex-shrink-0">{worker.title}</p>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 flex-shrink-0">
            <MapPin className="h-4 w-4" />
            <span>{worker.city}</span>
          </div>
          
        </div>
         <div className="mt-4 pt-3 border-t border-border/60 flex-shrink-0">
           <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-amber-500 ml-1">({worker.rating})</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(worker.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
      </Card>
    </Link>
  );
}
