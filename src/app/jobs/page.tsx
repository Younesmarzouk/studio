
"use client"

import JobCard from '@/components/job-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Briefcase } from 'lucide-react';
import type { Job } from '@/lib/data';
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { professions } from "@/lib/professions"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عروض العمل',
  description: 'تصفح أحدث عروض العمل والفرص المتاحة في مختلف المجالات والمدن.',
};


export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    workType: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
      const fetchJobs = async () => {
          setLoading(true);
          try {
              const adsCollection = collection(db, 'ads');
              const q = query(adsCollection, orderBy('createdAt', 'desc'));
              const querySnapshot = await getDocs(q);
              const allAds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              
              const fetchedJobs = allAds
                .filter((ad: any) => ad.type === 'job')
                .map((data: any) => {
                    return {
                        id: data.id,
                        slug: data.slug || data.id,
                        title: data.title,
                        city: data.city,
                        price: data.price,
                        rating: data.rating || 4.5,
                        featured: data.featured || false,
                        icon: data.category || 'other',
                        workType: data.workType,
                        likes: data.likes || 0,
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
  
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterSheetOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { city: '', category: '', workType: '' };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    setIsFilterSheetOpen(false);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchTermMatch = !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.city.toLowerCase().includes(searchTerm.toLowerCase());

      const cityMatch = !filters.city || job.city.toLowerCase().includes(filters.city.toLowerCase());
      const categoryMatch = !filters.category || job.icon === filters.category;
      const workTypeMatch = !filters.workType || job.workType === filters.workType;

      return searchTermMatch && cityMatch && categoryMatch && workTypeMatch;
    });
  }, [searchTerm, jobs, filters]);

  const pageContent = (
    <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><Briefcase className="h-8 w-8"/> عروض العمل</h1>
        
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-6">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="ابحث عن وظيفة أو خدمة..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-border bg-card"
              dir="rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
          </div>
           <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]" dir="rtl">
                <SheetHeader>
                    <SheetTitle>فرز النتائج</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="city-filter">المدينة</Label>
                        <Input
                            id="city-filter"
                            placeholder="ابحث بالمدينة..."
                            value={tempFilters.city}
                            onChange={(e) => setTempFilters({ ...tempFilters, city: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="category-filter">الفئة / الحرفة</Label>
                        <Select
                            value={tempFilters.category}
                            onValueChange={(value) => setTempFilters({ ...tempFilters, category: value === 'all' ? '' : value })}
                        >
                            <SelectTrigger id="category-filter">
                                <SelectValue placeholder="كل الفئات" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">كل الفئات</SelectItem>
                                {professions.map(prof => (
                                    <SelectItem key={prof.value} value={prof.value}>{prof.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="work-type-filter">طبيعة العمل</Label>
                         <Select
                            value={tempFilters.workType}
                            onValueChange={(value) => setTempFilters({ ...tempFilters, workType: value === 'all' ? '' : value })}
                        >
                            <SelectTrigger id="work-type-filter">
                                <SelectValue placeholder="كل الأنواع" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">كل الأنواع</SelectItem>
                                <SelectItem value="daily">يومي</SelectItem>
                                <SelectItem value="part-time">دوام جزئي</SelectItem>
                                <SelectItem value="seasonal">موسمي</SelectItem>
                                <SelectItem value="full-time">دوام كامل</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <Button variant="outline" onClick={handleClearFilters}>مسح الفلاتر</Button>
                    <Button onClick={handleApplyFilters}>تطبيق</Button>
                </SheetFooter>
            </SheetContent>
          </Sheet>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="w-full">
                <JobCard job={job} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          )}
        </div>
      </div>
  );

  if (loading) {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><Briefcase className="h-8 w-8"/> عروض العمل</h1>
            <div className="flex gap-2 mb-6">
                <Skeleton className="h-12 flex-grow rounded-xl" />
                <Skeleton className="h-12 w-12 rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
            </div>
        </div>
    );
  }

  return pageContent;
}
