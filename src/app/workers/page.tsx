"use client"

import WorkerCard from '@/components/worker-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Worker } from '@/lib/data';
import PageHeader from '@/components/page-header';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchWorkers = async () => {
          setLoading(true);
          try {
              const usersCollection = collection(db, 'users');
              const q = query(usersCollection);
              const querySnapshot = await getDocs(q);
              const fetchedWorkers = querySnapshot.docs.map(doc => {
                  const data = doc.data();
                  return {
                    id: doc.id,
                    name: data.name,
                    avatar: data.avatar || `https://placehold.co/100x100.png`,
                    'data-ai-hint': 'person face',
                    title: data.title || 'باحث عن عمل',
                    city: data.location || 'غير محدد',
                    rating: data.rating || 4.5,
                  } as Worker
              });
              setWorkers(fetchedWorkers);
          } catch (error) {
              console.error("Error fetching workers: ", error);
          } finally {
              setLoading(false);
          }
      };

      fetchWorkers();
  }, []);

  if (loading) {
    return (
        <div>
            <PageHeader title="الباحثون عن عمل" />
            <div className="p-4">
                <div className="flex gap-2 mb-6">
                    <Skeleton className="h-12 flex-grow rounded-xl" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div>
      <PageHeader title="الباحثون عن عمل" />
      <div className="p-4">
        
        <div className="flex gap-2 mb-6">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="ابحث عن عامل أو حرفي..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-border bg-card"
              dir="rtl"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {workers.map(worker => (
            <div key={worker.id} className="w-full">
              <WorkerCard worker={worker} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
