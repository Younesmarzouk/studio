
import Link from 'next/link';
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, User, Clock, Wallet, Pencil, Trash2, Heart } from "lucide-react";
import type { Job } from '@/lib/data';
import { iconMap, getProfessionByValue } from '@/lib/professions';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

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
    <Card className="overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right w-full bg-card rounded-2xl">
      <div className="flex-grow flex flex-col p-4">
        <Link href={`/jobs/${job.id}`} className="block h-full group flex flex-col flex-grow">
          {job.featured && <Badge className="absolute top-2 left-2 bg-green-100 text-green-800 border-green-200 z-10">مميز</Badge>}
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-xl flex items-center justify-center">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-grow">
              <Badge variant="outline" className="mb-1">{professionLabel}</Badge>
              <h3 className="font-bold text-xl text-foreground leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex-grow space-y-3 text-sm text-foreground">
              <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">المدينة:</span>
                  <span>{job.city}</span>
              </div>
              {job.price && (
                  <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">الأجر:</span>
                  <span>{job.price} درهم</span>
                  </div>
              )}
              {job.workType && (
                  <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">طبيعة العمل:</span>
                  <span>{workTypeMap[job.workType]}</span>
                  </div>
              )}
          </div>
          
          <div className="mt-auto pt-4 flex-shrink-0">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="font-medium">({job.rating.toFixed(1)})</span>
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="font-medium">{job.likes || 0}</span>
                  <Heart className="h-4 w-4" />
                </div>
              </div>
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
                عرض التفاصيل
              </div>
            </div>
          </div>
        </Link>
      </div>
      {isEditable && onDeleteClick && (
        <div className="px-4 pb-4 pt-0">
          <Separator className="mb-3" />
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/jobs/edit/${job.id}`}>
                <Pencil className="ml-2 h-4 w-4" /> تعديل
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} className="flex-1">
              <Trash2 className="ml-2 h-4 w-4" /> حذف
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
