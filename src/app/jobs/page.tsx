import JobCard from '@/components/job-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { jobs } from '@/lib/data';

// Let's expand the list of jobs for a richer page
const allJobs = [
  ...jobs,
  {
    id: 5,
    title: "مطلوب مصمم داخلي",
    city: "أكادير",
    price: "حسب المشروع",
    rating: 4.8,
    featured: false,
    icon: "PaintRoller",
    image: "https://placehold.co/600x400.png",
    "data-ai-hint": "interior design",
  },
  {
    id: 6,
    title: "مساعدة منزلية",
    city: "فاس",
    price: "120 درهم/اليوم",
    rating: 4.3,
    featured: false,
    icon: "Users",
  },
  {
    id: 7,
    title: "خبير تسويق رقمي",
    city: "الدار البيضاء",
    price: "7000 درهم/الشهر",
    rating: 4.9,
    featured: true,
    icon: "TrendingUp",
    image: "https://placehold.co/600x400.png",
    "data-ai-hint": "digital marketing chart",
  },
  {
    id: 8,
    title: "حدائقي لتنسيق فيلا",
    city: "مراكش",
    price: "250 درهم",
    rating: 4.6,
    featured: false,
    icon: "Sprout",
  },
];

export default function JobsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">عروض العمل</h1>
      
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allJobs.map(job => (
          <div key={job.id} className="w-full">
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}
