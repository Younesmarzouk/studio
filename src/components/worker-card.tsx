
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
      <Card className="overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col p-4 text-center">
        
        <div className="flex-shrink-0 w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto my-4">
          <IconComponent className="h-10 w-10 text-secondary-foreground" />
        </div>

        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-foreground">{worker.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 flex-shrink-0">{worker.title}</p>
          
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1 flex-shrink-0">
            <MapPin className="h-4 w-4" />
            <span>{worker.city}</span>
          </div>
          
          <div className="flex items-center justify-center gap-1 mt-2 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({worker.rating})</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

    