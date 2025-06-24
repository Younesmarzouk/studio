"use client"

import { notFound, useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Hammer, Calendar, Wallet, FileText, ChevronLeft, Zap, Wrench, Code, PaintRoller, Users, TrendingUp, Sprout, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as React from 'react';
import Image from 'next/image';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Job } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useToast } from "@/hooks/use-toast"

type Ad = Job & {
    description?: string;
    responsibilities?: string[];
    userId?: string;
    userName?: string;
    userAvatar?: string;
};

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
  const router = useRouter();
  const { toast } = useToast();

  const [job, setJob] = React.useState<Ad | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isContacting, setIsContacting] = React.useState(false);
  const [user, authLoading] = useAuthState(auth);

  React.useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      const docRef = doc(db, 'ads', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setJob({ id: docSnap.id, ...data } as Ad);
      } else {
        setJob(null); // Explicitly set to null if not found
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  const handleContact = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول أولاً للتواصل مع صاحب الإعلان.",
      });
      return router.push('/login');
    }
    if (!job || !job.userId || !job.userName) {
      toast({ variant: "destructive", title: "خطأ", description: "معلومات صاحب الإعلان غير متوفرة." });
      return;
    }
    
    setIsContacting(true);
    
    try {
      // Get current user's profile to store in chat participants
      const currentUserDocRef = doc(db, 'users', user.uid);
      const currentUserDocSnap = await getDoc(currentUserDocRef);
      if (!currentUserDocSnap.exists()) {
        throw new Error("لم يتم العثور على ملفك الشخصي. يرجى إكمال ملفك الشخصي أولاً.");
      }
      const currentUserProfile = currentUserDocSnap.data();
      
      const chatId = [user.uid, job.userId].sort().join('_');
      const chatDocRef = doc(db, 'chats', chatId);

      const chatSnap = await getDoc(chatDocRef);
      if (!chatSnap.exists()) {
          await setDoc(chatDocRef, {
              members: [user.uid, job.userId],
              createdAt: serverTimestamp(),
              participants: {
                  [user.uid]: {
                      name: currentUserProfile.name,
                      avatar: currentUserProfile.avatar
                  },
                  [job.userId]: {
                      name: job.userName,
                      avatar: job.userAvatar || ''
                  }
              }
          }, { merge: true });
      }
      
      router.push(`/messages/chat?partnerId=${job.userId}&partnerName=${encodeURIComponent(job.userName)}&partnerAvatar=${encodeURIComponent(job.userAvatar || '')}`);

    } catch (error: any) {
        console.error("Error creating or getting chat:", error);
        toast({
            variant: "destructive",
            title: "فشل بدء المحادثة",
            description: error.message || "حدث خطأ ما، يرجى المحاولة مرة أخرى.",
        });
    } finally {
        setIsContacting(false);
    }
  }


  if (loading || authLoading) {
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

  const IconComponent = iconMap[job.icon || 'Default'] || Hammer;
  const isOwnAd = user && user.uid === job.userId;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            العودة إلى كل الوظائف
        </Link>
      <Card>
        {job.image && (
          <div className="relative h-64 w-full">
            <Image src={job.image} alt={job.title} layout="fill" className="object-cover" data-ai-hint={job['data-ai-hint']} />
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
                <span className="font-bold">{job.rating || 4.5}</span>
                <span className="text-xs text-muted-foreground">(تقييم)</span>
            </div>
            {job.price && (<div className="flex items-center gap-1 text-muted-foreground">
                <Wallet className="h-5 w-5" />
                <span>{job.price}</span>
            </div>)}
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

            <div className="mt-8 pt-6 border-t text-center">
                 {isOwnAd ? (
                     <p className="text-sm text-muted-foreground">هذا هو إعلانك.</p>
                 ) : (
                    <Button size="lg" className="w-full md:w-auto" onClick={handleContact} disabled={isContacting || authLoading}>
                        {isContacting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <MessageSquare className="ml-2 h-5 w-5" />}
                        {isContacting ? 'جاري التحضير...' : (user ? 'تواصل مع صاحب العمل' : 'سجل الدخول للتواصل')}
                    </Button>
                 )}
                {!isOwnAd && <p className="text-xs text-muted-foreground mt-2">سيتم نقلك إلى صفحة المحادثة للتواصل.</p>}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
