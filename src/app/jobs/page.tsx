
"use client"

import JobCard from '@/components/job-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Job } from '@/lib/data';
import PageHeader from '@/components/page-header';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchJobs = async () => {
          setLoading(true);
          try {
              const adsCollection = collection(db, 'ads');
              // We query all ads and sort by date, then filter for 'job' on the client.
              // This avoids needing a composite index on 'type' and 'createdAt'.
              const q = query(adsCollection, orderBy('createdAt', 'desc'));
              const querySnapshot = await getDocs(q);
              const allAds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              
              const fetchedJobs = allAds
                .filter((ad: any) => ad.type === 'job')
                .map((data: any) => {
                    return {
                        id: data.id,
                        title: data.title,
                        city: data.city,
                        price: data.price,
                        rating: data.rating || 4.5,
                        featured: data.featured || false,
                        icon: data.category || 'other',
                        workType: data.workType,
                    } as Job;
                });
              setJobs(fetchedJobs);
          } catch (error) {
              console.error("Error fetching jobs: ", error);
          } finally {
              setLoading(false);
          }
      };

      fetchJobs();
  }, []);

  if (loading) {
    return (
        <div>
            <PageHeader title="عروض العمل" />
            <div className="p-4">
                <div className="flex gap-2 mb-6">
                    <Skeleton className="h-12 flex-grow rounded-xl" />
                    <Skeleton className="h-12 w-12 rounded-md" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div>
      <PageHeader title="عروض العمل" />
      <div className="p-4">
        
        <div className="flex gap-2 mb-6">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="ابحث عن وظيفة أو خدمة..."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="w-full">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
