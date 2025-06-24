
import Link from 'next/link';
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, User } from "lucide-react";
import type { Job } from '@/lib/data';
import { iconMap } from '@/lib/professions';

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const IconComponent = iconMap[job.icon] || User;

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full group">
      <Card className="overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col p-4 text-center relative">
        {job.featured && <Badge className="absolute top-2 left-2 bg-green-500 text-white z-10 border-green-500">مميز</Badge>}
        
        <div className="flex-shrink-0 w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto my-4">
          <IconComponent className="h-10 w-10 text-accent-foreground" />
        </div>
        
        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-foreground flex-grow">{job.title}</h3>
          
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1 flex-shrink-0">
            <MapPin className="h-4 w-4" />
            <span>{job.city}</span>
          </div>

          {job.price && <p className="font-bold text-primary mt-2 text-md flex-shrink-0">{job.price}</p>}
          
          <div className="flex items-center justify-center gap-1 mt-2 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(job.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({job.rating})</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

    