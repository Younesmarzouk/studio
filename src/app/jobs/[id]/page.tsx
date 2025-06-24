"use client"

import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Hammer, Calendar, Wallet, FileText, ChevronLeft, Zap, Wrench, Code, PaintRoller, Users, TrendingUp, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as React from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Job } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: { [key: string]: React.ElementType } = {
  Hammer,
  Zap,
  Wrench,
  Code,
  PaintRoller,
  Users,
  TrendingUp,
  Sprout,
  carpentry: Hammer,
  electricity: Zap,
  plumbing: Wrench,
  design: PaintRoller,
  development: Code,
  other: Hammer,
  Default: Hammer,
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = React.useState<Job | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      const docRef = doc(db, 'ads', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setJob({
          id: docSnap.id,
          title: data.title,
          city: data.city,
          price: data.price,
          rating: data.rating || 4.5,
          featured: data.featured || false,
          icon: data.category || 'Default',
          image: data.imageUrl,
          description: data.description,
          responsibilities: data.responsibilities,
        } as any); // Using 'any' to accommodate extra fields like description
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);


  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Card>
          <Skeleton className="h-64 w-full" />
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t mt-4 flex-wrap">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-20 w-full" />
             <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-24 w-full" />
            <div className="mt-8 pt-6 border-t text-center">
              <Skeleton className="h-12 w-48 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return notFound();
  }

  const IconComponent = iconMap[job.icon] || Hammer;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            العودة إلى كل الوظائف
        </Link>
      <Card>
        {job.image && (
          <div className="relative h-64 w-full">
            <Image src={job.image} alt={job.title} fill className="object-cover" data-ai-hint={job['data-ai-hint']} />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-accent-foreground" />
                </div>
                <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.city}</span>
                    </div>
                </div>
              </div>
            </div>
            {job.featured && <Badge variant="secondary" className="bg-green-100 text-green-800">مميز</Badge>}
          </div>
           <div className="flex items-center gap-4 pt-4 border-t mt-4 flex-wrap">
             <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{job.rating}</span>
                <span className="text-xs text-muted-foreground">(تقييم)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
                <Wallet className="h-5 w-5" />
                <span>{job.price}</span>
            </div>
             <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>نشر قبل 3 أيام</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><FileText className="text-primary"/> وصف الوظيفة</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {(job as any).description || "لا يوجد وصف متوفر."}
                    </p>
                </div>
                 <div>
                    <h3 className="font-bold text-lg mb-2">المسؤوليات</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>تصنيع وتركيب الأثاث حسب الطلب.</li>
                        <li>قراءة وفهم المخططات والتصاميم الهندسية.</li>
                        <li>استخدام الأدوات اليدوية والكهربائية بأمان.</li>
                        <li>ضمان جودة العمل والتشطيبات النهائية.</li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t text-center">
                <Link href="/messages/chat" passHref>
                    <Button size="lg" className="w-full md:w-auto">
                        تواصل مع صاحب العمل
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-2">سيتم نقلك إلى صفحة المحادثة للتواصل.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
