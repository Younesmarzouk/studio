
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Calendar, Wallet, FileText, Phone, User as UserIcon, Clock, Copy, Heart, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as React from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getProfessionByValue } from '@/lib/professions';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';
import type { Ad } from '@/lib/data';
import { useParams, notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const workTypeMap: { [key: string]: string } = {
  daily: "يومي",
  "part-time": "دوام جزئي",
  seasonal: "موسمي",
  "full-time": "دوام كامل",
};

const WorkerDetailsSkeleton = () => (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-24 h-24 rounded-lg" />
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex items-center gap-4 pt-4 border-t mt-4 flex-wrap">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-28" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full mt-2" />
                    <Skeleton className="h-5 w-3/4 mt-2" />
                </div>
                <div className="mt-8 pt-6 border-t">
                    <Skeleton className="h-7 w-48 mx-auto mb-4" />
                    <Card><CardContent className="p-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        <Skeleton className="h-8 w-40" />
                        <div className="flex gap-2">
                           <Skeleton className="h-10 w-24" />
                           <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent></Card>
                </div>
            </CardContent>
        </Card>
    </div>
);


export default function WorkerDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();

    const [user, authLoading] = useAuthState(auth);
    const [ad, setAd] = React.useState<Ad | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [likeCount, setLikeCount] = React.useState(0);
    const [isLiked, setIsLiked] = React.useState(false);
    const [isLiking, setIsLiking] = React.useState(false);

    React.useEffect(() => {
        const fetchAd = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'ads', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setAd({ id: docSnap.id, ...data } as Ad);
                    setLikeCount(data.likes || 0);
                } else {
                    setAd(null);
                }
            } catch (error) {
                console.error("Error fetching worker ad:", error);
                setAd(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    React.useEffect(() => {
        if (user && ad) {
            setIsLiked((ad.likedBy || []).includes(user.uid));
        } else {
            setIsLiked(false);
        }
    }, [user, ad]);

    const handleLike = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'يجب تسجيل الدخول أولاً', description: "الرجاء تسجيل الدخول لتتمكن من التفاعل مع الإعلانات." });
            return;
        }
        if (isLiking || !ad) return;

        setIsLiking(true);
        const adRef = doc(db, 'ads', ad.id as string);

        try {
            if (!isLiked) {
                await updateDoc(adRef, { likes: increment(1), likedBy: arrayUnion(user.uid) });
                setLikeCount(prev => prev + 1);
                setIsLiked(true);
            } else {
                await updateDoc(adRef, { likes: increment(-1), likedBy: arrayRemove(user.uid) });
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

    if (loading) {
        return <WorkerDetailsSkeleton />;
    }

    if (!ad) {
        return notFound();
    }

    const profession = getProfessionByValue(ad.category);
    const IconComponent = profession?.icon || UserIcon;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex items-center gap-4">
                                <Link href={`/users/${ad.userId}`} className="group">
                                    <Avatar className="w-24 h-24 border-2 border-primary/20">
                                        <AvatarImage src={ad.userAvatar} alt={ad.userName} data-ai-hint="person face"/>
                                        <AvatarFallback>{ad.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <CardTitle className="text-2xl mb-1 text-primary">{ad.title}</CardTitle>
                                    <Link href={`/users/${ad.userId}`} className="group">
                                        <div className="flex items-center gap-1 text-base text-muted-foreground group-hover:underline">
                                            <UserIcon className="h-5 w-5" />
                                            <span>{ad.userName}</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {profession && <Badge variant="secondary">{profession.label}</Badge>}
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t mt-4 flex-wrap">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-5 w-5" />
                                <span>{ad.city}</span>
                            </div>
                            {ad.price && (<div className="flex items-center gap-1 text-muted-foreground">
                                <Wallet className="h-5 w-5" />
                                <span>{ad.price} درهم</span>
                            </div>)}
                            {ad.workType && (<div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-5 w-5" />
                                <span>{workTypeMap[ad.workType]}</span>
                            </div>)}
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
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-primary"><FileText /> الوصف</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {ad.description || "لا يوجد وصف متوفر."}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t">
                            <h3 className="text-lg font-bold mb-4 text-center text-primary">معلومات التواصل</h3>
                            <Card className="bg-card">
                                <CardContent className="p-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-6 w-6 text-primary" />
                                    <span className="text-lg font-semibold tracking-wider">{ad.userPhone || "لم يضف رقم الهاتف"}</span>
                                </div>
                                {ad.userPhone ? (
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleCopy(ad.userPhone!)}>
                                            <Copy className="ml-2 h-4 w-4" />
                                            نسخ
                                        </Button>
                                        <Button asChild>
                                        <a href={`tel:${ad.userPhone}`}>
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
