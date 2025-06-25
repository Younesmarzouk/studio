
"use client"

import WorkerCard from '@/components/worker-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { professions } from '@/lib/professions';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    category: '',
  });
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
      const fetchWorkers = async () => {
          setLoading(true);
          try {
              const adsCollection = collection(db, 'ads');
              const q = query(adsCollection, orderBy('createdAt', 'desc'));
              const querySnapshot = await getDocs(q);
              
              const fetchedWorkerAds = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter((ad: any) => ad.type === 'worker');

              setWorkers(fetchedWorkerAds);
          } catch (error) {
              console.error("Error fetching workers: ", error);
          } finally {
              setLoading(false);
          }
      };

      fetchWorkers();
  }, []);
  
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterSheetOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { city: '', category: '' };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    setIsFilterSheetOpen(false);
  };

  const filteredWorkers = useMemo(() => {
    return workers.filter(workerAd => {
      const searchTermMatch = !searchTerm ||
        (workerAd.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (workerAd.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (workerAd.city || '').toLowerCase().includes(searchTerm.toLowerCase());

      const cityMatch = !filters.city || (workerAd.city || '').toLowerCase().includes(filters.city.toLowerCase());
      const categoryMatch = !filters.category || workerAd.category === filters.category;

      return searchTermMatch && cityMatch && categoryMatch;
    });
  }, [searchTerm, workers, filters]);

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
                        <Label htmlFor="category-filter">الحرفة</Label>
                        <Select
                            value={tempFilters.category}
                            onValueChange={(value) => setTempFilters({ ...tempFilters, category: value })}
                        >
                            <SelectTrigger id="category-filter">
                                <SelectValue placeholder="كل الحرف" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">كل الحرف</SelectItem>
                                {professions.map(prof => (
                                    <SelectItem key={prof.value} value={prof.value}>{prof.label}</SelectItem>
                                ))}
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map(worker => (
              <div key={worker.id} className="w-full">
                <WorkerCard worker={worker} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
