
import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User as UserIcon } from "lucide-react";
import { iconMap, getProfessionByValue } from '@/lib/professions';

type WorkerCardProps = {
  worker: any; // Ad data object
};

export default function WorkerCard({ worker }: WorkerCardProps) {
  const profession = getProfessionByValue(worker.category);
  const IconComponent = profession?.icon || UserIcon;
  const professionLabel = profession?.label || worker.category;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out h-full flex flex-col text-right w-full bg-card rounded-2xl p-4">
      <Link href={`/users/${worker.userId}`} className="block h-full group flex flex-col flex-grow">
        <div className="flex-grow flex flex-col">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-xl flex items-center justify-center">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-grow min-w-0">
              <Badge variant="outline" className="mb-1">{professionLabel}</Badge>
              <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{worker.title}</h3>
            </div>
          </div>
          <div className="space-y-2 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span>{worker.userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{worker.city}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 flex-shrink-0">
          <div className="flex justify-end items-center text-sm">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
              عرض الملف الشخصي
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
