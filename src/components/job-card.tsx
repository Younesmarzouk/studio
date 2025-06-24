import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hammer, MapPin, Star, Zap, Wrench, Code, PaintRoller, Users, Sprout, Baby, Trash2 } from "lucide-react";
import type { Job } from '@/lib/data';

type JobCardProps = {
  job: Job;
};

const iconMap: { [key: string]: React.ElementType } = {
  Hammer,
  Zap,
  Wrench,
  Code,
  PaintRoller,
  Users,
  Sprout,
  Baby,
  Trash2,
  construction: Hammer,
  cleaning: Trash2,
  childcare: Baby,
  carpentry: Hammer,
  electricity: Zap,
  plumbing: Wrench,
  design: PaintRoller,
  development: Code,
  other: Hammer,
  Default: Hammer,
};


export default function JobCard({ job }: JobCardProps) {
  const IconComponent = iconMap[job.icon] || Hammer;

  return (
    <Link href={`/jobs/${job.id}`} className="block h-full group">
      <Card className="overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col">
        <div className="relative h-32 w-full">
            {job.image ? (
              <Image src={job.image} alt={job.title} fill className="object-cover" data-ai-hint={job['data-ai-hint']} />
            ) : (
              <div className="w-full h-full bg-accent flex items-center justify-center">
                <IconComponent className="h-12 w-12 text-accent-foreground" />
              </div>
            )}
            {job.featured && <Badge variant="secondary" className="absolute top-2 left-2 bg-green-500 text-white z-10">مميز</Badge>}
        </div>

        <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
          <h3 className="font-bold text-md text-foreground truncate w-full flex-grow mt-2">{job.title}</h3>
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
