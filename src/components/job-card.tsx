import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hammer, MapPin, Star } from "lucide-react";
import type { Job } from '@/lib/data';

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <Card className="overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 ease-in-out h-full flex flex-col">
        <CardContent className="p-4 flex flex-col items-center text-center relative flex-grow">
          {job.featured && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-green-500 text-white">مميز</Badge>
          )}
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-3 flex-shrink-0">
            <Hammer className="h-8 w-8 text-accent-foreground" />
          </div>
          <h3 className="font-bold text-md text-foreground truncate w-full flex-grow">{job.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 flex-shrink-0">
            <MapPin className="h-4 w-4" />
            <span>{job.city}</span>
          </div>
          <p className="font-bold text-primary mt-2 text-sm flex-shrink-0">{job.price}</p>
          <div className="flex items-center gap-1 mt-1 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(job.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-muted-foreground">({job.rating})</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
