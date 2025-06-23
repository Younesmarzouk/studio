import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, Star } from "lucide-react";
import type { Worker } from '@/lib/data';

type WorkerCardProps = {
  worker: Worker;
};

export default function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Link href={`/profile/${worker.id}`} className="block h-full">
      <Card className="overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 ease-in-out h-full flex flex-col">
        <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-3 flex-shrink-0">
            <User className="h-8 w-8 text-accent-foreground" />
          </div>
          <h3 className="font-bold text-md text-foreground truncate w-full">{worker.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{worker.city}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex-grow">{worker.title}</p>
          <div className="flex items-center gap-1 mt-2 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(worker.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-muted-foreground">({worker.rating})</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
