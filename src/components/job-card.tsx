
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
      <Card className="overflow-hidden shadow-md group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right relative bg-card rounded-2xl p-4">
        {job.featured && <Badge className="absolute top-4 left-4 bg-green-100 text-green-800 border-green-200 z-10">مميز</Badge>}
        
        <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-primary" />
        </div>

        <div className="flex flex-col flex-grow mt-4">
          <h3 className="font-bold text-lg text-foreground leading-tight">{job.title}</h3>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span>{job.city}</span>
          </div>

          <div className="font-bold text-primary text-lg mt-2">
              {job.price || "حسب الاتفاق"}
          </div>

        </div>
        
         <div className="mt-4 pt-4 border-t border-border/60 flex-shrink-0">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground ml-1 font-medium">({job.rating.toFixed(1)})</span>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(job.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
               {job.workType && (
                  <Badge variant="outline">
                      {workTypeMap[job.workType] || job.workType}
                  </Badge>
              )}
            </div>
          </div>
      </Card>
    </Link>
  );
}
