
"use client"

import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Calendar, Wallet, FileText, Phone, User as UserIcon, Clock, Copy, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as React from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { Job } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { iconMap } from '@/lib/professions';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/page-header';


type Ad = Job & {
    description?: string;
    responsibilities?: string[];
    userId?: string;
    userName?: string;
    userAvatar?: string;
    userPhone?: string;
    workType?: string;
    likes: number;
    likedBy: string[];
};

const workTypeMap: { [key: string]: string } = {
  daily: "يومي",
  "part-time": "دوام جزئي",
  seasonal: "موسمي",
  "full-time": "دوام كامل",
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  
  const [job, setJob] = React.useState<Ad | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  const [user, authLoading] = useAuthState(auth);
  const [likeCount, setLikeCount] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isLiking, setIsLiking] = React.useState(false);
  
  React.useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      const docRef = doc(db, 'ads', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let adData: Ad = { id: docSnap.id, ...data, icon: data.category || 'other' } as Ad;
        
        if (data.userId) {
          const userRef = doc(db, 'users', data.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
              const userData = userSnap.data();
              adData.userName = userData.name;
              adData.userAvatar = userData.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${userData.email}`;
          }
        }
        
        setJob(adData);
        setLikeCount(adData.likes || 0);

      } else {
        setJob(null);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  React.useEffect(() => {
    if (user && job) {
      setIsLiked((job.likedBy || []).includes(user.uid));
    }
  }, [user, job]);

  const handleLike = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'يجب تسجيل الدخول أولاً', description: "الرجاء تسجيل الدخول لتتمكن من التفاعل مع الإعلانات." });
        return;
    }
    if (isLiking) return;

    setIsLiking(true);
    const adRef = doc(db, 'ads', id);

    try {
        if (!isLiked) {
            await updateDoc(adRef, {
                likes: increment(1),
                likedBy: arrayUnion(user.uid)
            });
            setLikeCount(prev => prev + 1);
            setIsLiked(true);
        } else {
            await updateDoc(adRef, {
                likes: increment(-1),
                likedBy: arrayRemove(user.uid)
            });
            setLikeCount(prev => prev - 1);
            setIsLiked(false);
        }
    } catch (e: any) {
        console.error("Like operation failed: ", e);
        let description = "فشل تحديث التفاعل. الرجاء المحاولة مرة أخرى.";
        if (e.code === 'permission-denied') {
            description = "ليست لديك الصلاحية لهذا الإجراء. قد تحتاج إلى مراجعة قواعد الأمان في Firestore.";
        }
        toast({ variant: 'destructive', title: 'حدث خطأ ما', description: description });
    } finally {
        setIsLiking(false);
    }
  };

  const handleCopy = (text: string) => {
    if (text) {
        navigator.clipboard.writeText(text);
        toast({ title: "تم نسخ الرقم بنجاح!" });
    }
  };

  if (loading || authLoading) {
    return (
      <div>
        <PageHeader title="تفاصيل الإعلان" icon={<FileText className="h-6 w-6" />} showBackButton />
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
            <Card>
            <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                <Skeleton className="w-24 h-24 rounded-full" />
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
      </div>
    );
  }

  if (!job) {
    return notFound();
  }

  const IconComponent = iconMap[job.icon] || UserIcon;

  return (
    <div>
        <PageHeader title="تفاصيل الإعلان" icon={<FileText className="h-6 w-6" />} showBackButton />
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-12 w-12" />
                </div>
                <div>
                    <CardTitle className="text-2xl mb-1 text-primary">{job.title}</CardTitle>
                    <div className="flex items-center gap-1 text-base text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{job.city}</span>
                    </div>
                </div>
            </div>
            {job.featured && <Badge variant="secondary" className="bg-green-100 text-green-800 self-start sm:self-center">مميز</Badge>}
          </div>
           <div className="flex items-center gap-4 pt-4 border-t mt-4 flex-wrap">
             <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{job.rating || 4.5}</span>
                <span className="text-xs text-muted-foreground">(تقييم)</span>
            </div>
            {job.price && (<div className="flex items-center gap-1 text-muted-foreground">
                <Wallet className="h-5 w-5" />
                <span>{job.price} درهم</span>
            </div>)}
            {job.workType && (<div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{workTypeMap[job.workType]}</span>
            </div>)}
             <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>نشر قبل 3 أيام</span>
            </div>
             <div className="flex items-center gap-1 text-muted-foreground">
                 <Button variant={isLiked ? "default" : "outline"} onClick={handleLike} disabled={isLiking || authLoading} size="sm">
                    <Heart className={cn("ml-2 h-4 w-4", isLiked && "fill-current")} />
                    {isLiking ? 'جاري...' : (isLiked ? 'أنا مهتم' : 'مهتم')} ({likeCount})
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-primary"><FileText /> وصف الوظيفة</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {job.description || "لا يوجد وصف متوفر."}
                    </p>
                </div>
                 {job.responsibilities && job.responsibilities.length > 0 && (
                 <div>
                    <h3 className="font-bold text-lg mb-2">المسؤوليات</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {job.responsibilities.map((resp, index) => (
                           <li key={index}>{resp}</li>
                        ))}
                    </ul>
                </div>)}
                {job.userId && job.userName && (
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">صاحب الإعلان</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Link href={`/users/${job.userId}`} className="flex items-center gap-3 group">
                                <Avatar>
                                    <AvatarImage src={job.userAvatar} alt={job.userName} data-ai-hint="person face" />
                                    <AvatarFallback>{job.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold group-hover:underline">{job.userName}</span>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-bold mb-4 text-center text-primary">معلومات التواصل</h3>
              <Card className="bg-card">
                <CardContent className="p-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-3">
                      <Phone className="h-6 w-6 text-primary" />
                      <span className="text-lg font-semibold tracking-wider">{job.userPhone || "لم يضف رقم الهاتف"}</span>
                  </div>
                  {job.userPhone ? (
                    <div className="flex gap-2">
                        <Button onClick={() => handleCopy(job.userPhone!)}>
                            <Copy className="ml-2 h-4 w-4" />
                            نسخ
                        </Button>
                        <Button asChild>
                          <a href={`tel:${job.userPhone}`}>
                            <Phone className="ml-2 h-4 w-4" />
                            اتصال
                          </a>
                        </Button>
                    </div>
                  ) : (
                      <Button disabled variant="outline">
                        لا يوجد رقم للاتصال
                      </Button>
                  )}
                </CardContent>
              </Card>
            </div>

        </CardContent>
      </Card>
      </div>
    </div>
  );
}
