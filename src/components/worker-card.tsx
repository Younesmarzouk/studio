
import Link from 'next/link';
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User as UserIcon, Pencil, Trash2, Heart } from "lucide-react";
import { iconMap, getProfessionByValue } from '@/lib/professions';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type WorkerCardProps = {
  worker: any; // Ad data object
  isEditable?: boolean;
  onDeleteClick?: (id: string) => void;
};

export default function WorkerCard({ worker, isEditable = false, onDeleteClick }: WorkerCardProps) {
  const profession = getProfessionByValue(worker.category);
  const IconComponent = profession?.icon || UserIcon;
  const professionLabel = profession?.label || worker.category;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(worker.id.toString());
    }
  };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right w-full bg-card rounded-2xl">
       <div className="flex-grow flex flex-col p-4">
          <Link href={`/workers/${worker.id}`} className="block h-full group flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-xl flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-grow min-w-0">
                  <Badge variant="outline" className="mb-1">{professionLabel}</Badge>
                  <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{worker.title}</h3>
                </div>
              </div>

              <div className="flex-grow space-y-2 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                   <span className="font-medium">الاسم:</span>
                  <span>{worker.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                   <span className="font-medium">المدينة:</span>
                  <span>{worker.city}</span>
                </div>
              </div>

            <div className="mt-auto pt-4 flex-shrink-0">
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="font-medium">{worker.likes || 0}</span>
                  <Heart className="h-4 w-4" />
                </div>
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
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
              <Link href={`/jobs/edit/${worker.id}`}>
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
