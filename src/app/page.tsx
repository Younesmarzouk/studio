
"use client"

import Image from 'next/image';
import * as React from 'react';
import Autoplay from "embla-carousel-autoplay"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/carousel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft } from "lucide-react"
import { sliderItems } from '@/lib/data';
import type { Job, Worker } from '@/lib/data';
import Link from 'next/link';
import HomeHeader from '@/components/home-header';
import JobCard from '@/components/job-card';
import WorkerCard from '@/components/worker-card';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [workers, setWorkers] = React.useState<Worker[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch jobs (latest ads of type 'job')
            const adsQuery = query(collection(db, "ads"), orderBy("createdAt", "desc"), limit(8)); 
            const adsSnapshot = await getDocs(adsQuery);
            const allRecentAds = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const fetchedJobs = allRecentAds
                .filter((ad: any) => ad.type === 'job')
                .slice(0, 4) // Take the first 4 jobs
                .map((data: any) => {
                    return {
                        id: data.id,
                        title: data.title,
                        city: data.city,
                        price: data.price,
                        rating: data.rating || 4.5,
                        featured: data.featured || false,
                        icon: data.category || 'Hammer',
                        image: data.imageUrl,
                    } as Job;
                });
            setJobs(fetchedJobs);
            
            // Fetch workers (user profiles)
            const usersQuery = query(collection(db, "users"), limit(4));
            const usersSnapshot = await getDocs(usersQuery);
            const fetchedWorkers = usersSnapshot.docs.map(doc => {
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
            console.error("Error fetching homepage data: ", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);


  return (
    <div className="flex flex-col w-full">
      <HomeHeader />

      <div className="p-4 bg-secondary/30">
        <div className="relative">
          <Input
            type="search"
            placeholder="ابحث عن وظيفة، عامل، أو خدمة..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-border bg-card"
            dir="rtl"
          />
          <Button variant="ghost" size="icon" className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="px-4 pt-4">
        <Carousel 
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            direction: 'rtl',
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {sliderItems.map((item, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardContent className="relative flex aspect-video items-end justify-start p-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" data-ai-hint={item['data-ai-hint']} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="relative z-10 p-6 text-white w-full">
                      <h3 className="text-xl font-bold font-headline">{item.title}</h3>
                      <p className="text-sm">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      <section className="py-6">
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-lg font-bold text-foreground">عروض العمل</h2>
          <Link href="/jobs" className="flex items-center gap-1 text-sm text-primary font-semibold">
            عرض الكل
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide">
          {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-2/3 md:w-1/4">
                  <Skeleton className="h-60 w-full" />
                </div>
              ))
          ) : (
            jobs.map(job => (
              <div key={job.id} className="flex-shrink-0 w-2/3 md:w-1/4">
                <JobCard job={job} />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="py-6 bg-secondary/30">
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-lg font-bold text-foreground">باحثون عن عمل</h2>
          <Link href="/workers" className="flex items-center gap-1 text-sm text-primary font-semibold">
            عرض الكل
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide">
          {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-2/3 md:w-1/4">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))
          ) : (
            workers.map(worker => (
              <div key={worker.id} className="flex-shrink-0 w-2/3 md:w-1/4">
                <WorkerCard worker={worker} />
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
