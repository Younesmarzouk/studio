
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
import { getProfessionByValue } from '@/lib/professions';
import { useRouter } from 'next/navigation';

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [workers, setWorkers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        router.push(`/jobs?q=${searchTerm.trim()}`);
    } else {
        router.push('/jobs');
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch latest ads
            const adsQuery = query(collection(db, "ads"), orderBy("createdAt", "desc"), limit(8)); 
            const adsSnapshot = await getDocs(adsQuery);
            const allRecentAds = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter for jobs
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
                        icon: data.category || 'other',
                        workType: data.workType,
                    } as Job;
                });
            setJobs(fetchedJobs);
            
            // Filter for workers (job seekers) from the same ad fetch
            const fetchedWorkers = allRecentAds
                .filter((ad: any) => ad.type === 'worker')
                .slice(0, 4); // Take the first 4 workers
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
    <div className="flex flex-col w-full bg-background">
      <HomeHeader />

      <div className="px-4 -mt-8 z-10">
        <form onSubmit={handleSearch} className="relative flex items-center bg-card p-2 rounded-2xl shadow-md">
           <Input
            type="search"
            placeholder="ابحث عن وظيفة، عامل، أو خدمة..."
            className="w-full pl-4 pr-12 py-3 border-none bg-transparent focus-visible:ring-0 text-base"
            dir="rtl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="default" size="icon" className="absolute left-2 h-10 w-10 rounded-lg text-white">
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>
      
      <div className="px-4 pt-6">
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
                <Card className="overflow-hidden shadow-lg rounded-2xl">
                  <CardContent className="relative flex aspect-[16/8] items-end justify-start p-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" data-ai-hint={item['data-ai-hint']} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="relative z-10 p-6 text-white w-full">
                      <h3 className="text-2xl font-bold font-headline">{item.title}</h3>
                      <p className="text-base">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <section className="py-6">
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-xl font-bold text-foreground">عروض العمل</h2>
          <Link href="/jobs" className="flex items-center gap-1 text-sm text-primary font-semibold">
            <span>عرض الكل</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide">
          {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[80%] md:w-[45%] lg:w-[30%]">
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>
              ))
          ) : (
            jobs.map(job => (
              <div key={job.id} className="flex-shrink-0 w-[80%] md:w-[45%] lg:w-[30%]">
                <JobCard job={job} />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="py-6 bg-transparent">
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-xl font-bold text-foreground">باحثون عن عمل</h2>
          <Link href="/workers" className="flex items-center gap-1 text-sm text-primary font-semibold">
            <span>عرض الكل</span>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide">
          {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[70%] md:w-[40%] lg:w-[28%]">
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              ))
          ) : (
            workers.map(worker => (
              <div key={worker.id} className="flex-shrink-0 w-[70%] md:w-[40%] lg:w-[28%]">
                <WorkerCard worker={worker} />
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
