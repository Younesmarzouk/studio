import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import type { Worker } from '@/lib/data';
import Image from 'next/image';

type WorkerCardProps = {
  worker: Worker;
};

export default function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Link href={`/users/${worker.id}`} className="block h-full group">
      <Card className="overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 ease-in-out h-full flex flex-col">
        <CardContent className="p-4 flex flex-col items-center text-center relative flex-grow">
          <Image src={worker.avatar} alt={worker.name} width={80} height={80} className="rounded-full mb-3 flex-shrink-0 object-cover w-20 h-20" data-ai-hint={worker['data-ai-hint']} />
          <h3 className="font-bold text-md text-foreground flex-grow">{worker.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 flex-shrink-0">{worker.title}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 flex-shrink-0">
            <MapPin className="h-4 w-4" />
            <span>{worker.city}</span>
          </div>
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
