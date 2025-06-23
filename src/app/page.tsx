import Image from 'next/image';
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
import { jobs, sliderItems } from '@/lib/data';
import Link from 'next/link';
import HomeHeader from '@/components/home-header';
import JobCard from '@/components/job-card';

export default function Home() {
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
        <Carousel className="w-full"
          opts={{
            align: "start",
            loop: true,
            direction: 'rtl',
          }}
        >
          <CarouselContent>
            {sliderItems.map((item, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardContent className="relative flex aspect-video items-end justify-start p-0">
                    <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} data-ai-hint={item['data-ai-hint']} />
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
          {jobs.map(job => (
            <div key={job.id} className="flex-shrink-0 w-2/3 md:w-1/4">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
