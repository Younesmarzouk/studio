import { jobs } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Hammer, Calendar, Wallet, FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find(j => j.id.toString() === params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            العودة إلى كل الوظائف
        </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Hammer className="h-6 w-6 text-accent-foreground" />
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
                        نبحث عن نجار محترف وموهوب للانضمام إلى فريقنا. يجب أن يكون لديك خبرة في تصنيع وتركيب الأبواب والنوافذ والأثاث الخشبي. القدرة على قراءة المخططات والعمل بدقة هي أمور ضرورية.
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
                <Button size="lg" className="w-full md:w-auto">
                    تواصل مع صاحب العمل
                </Button>
                <p className="text-xs text-muted-foreground mt-2">تحتاج إلى تسجيل الدخول للتواصل</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
