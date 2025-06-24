
import Link from 'next/link';
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, User, Clock } from "lucide-react";
import type { Job } from '@/lib/data';
import { iconMap } from '@/lib/professions';

type JobCardProps = {
  job: Job;
};

const workTypeMap: { [key: string]: string } = {
  daily: "يومي",
  "part-time": "دوام جزئي",
  seasonal: "موسمي",
  "full-time": "دوام كامل",
};

export default function JobCard({ job }: JobCardProps) {
  const IconComponent = iconMap[job.icon] || User;

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full group">
      <Card className="overflow-hidden shadow-md group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col p-4 text-left relative bg-card rounded-2xl">
        {job.featured && <Badge className="absolute top-4 left-4 bg-green-100 text-green-800 border-green-200 z-10">مميز</Badge>}
        
        <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        
        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-foreground flex-grow leading-tight">{job.title}</h3>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 flex-shrink-0">
            <MapPin className="h-4 w-4" />
            <span>{job.city}</span>
          </div>

        </div>
         <div className="mt-4 pt-3 border-t border-border/60 flex-shrink-0">
            <div className="flex justify-between items-center">
              {job.price ? (
                <p className="font-bold text-primary text-base">{job.price}</p>
              ) : (
                  <p className="text-sm text-muted-foreground">حسب الاتفاق</p>
              )}
              {job.workType && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workTypeMap[job.workType] || job.workType}
                  </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm font-bold text-amber-500 ml-1">({job.rating})</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(job.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
      </Card>
    </Link>
  );
}
