
import Link from 'next/link';
import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, User, Clock, Wallet, Pencil, Trash2 } from "lucide-react";
import type { Job } from '@/lib/data';
import { iconMap, getProfessionByValue } from '@/lib/professions';
import { Button } from './ui/button';

type JobCardProps = {
  job: Job;
  isEditable?: boolean;
  onDeleteClick?: (id: string) => void;
};

const workTypeMap: { [key: string]: string } = {
  daily: "يومي",
  "part-time": "دوام جزئي",
  seasonal: "موسمي",
  "full-time": "دوام كامل",
};

export default function JobCard({ job, isEditable = false, onDeleteClick }: JobCardProps) {
  const profession = getProfessionByValue(job.icon);
  const IconComponent = profession?.icon || User;
  const professionLabel = profession?.label || job.icon;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(job.id.toString());
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right relative bg-card rounded-2xl p-4 w-full">
      <Link href={`/jobs/${job.id}`} className="block h-full group">
        {job.featured && <Badge className="absolute top-4 left-4 bg-green-100 text-green-800 border-green-200 z-10">مميز</Badge>}
        
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
                <Badge variant="outline" className="mt-1">{professionLabel}</Badge>
            </div>
        </div>

        <div className="flex flex-col flex-grow mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/80" />
                <span>{job.city}</span>
            </div>
            <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary/80" />
                <span>{job.price || "حسب الاتفاق"}</span>
            </div>
             {job.workType && (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/80" />
                    <span>{workTypeMap[job.workType] || job.workType}</span>
                </div>
            )}
        </div>
        
         <div className="mt-4 pt-4 border-t border-border/60 flex-shrink-0">
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                    <span className="text-muted-foreground ml-1 font-medium">({job.rating.toFixed(1)})</span>
                    {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(job.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    ))}
                </div>
                <Button variant="link" size="sm" className="p-0 h-auto">عرض التفاصيل</Button>
            </div>
          </div>
      </Link>
       {isEditable && (
        <div className="mt-4 pt-4 border-t flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/jobs/edit/${job.id}`}>
                <Pencil className="ml-2 h-4 w-4" /> تعديل
            </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} className="flex-1">
            <Trash2 className="ml-2 h-4 w-4" /> حذف
            </Button>
        </div>
        )}
    </Card>
  );
}
