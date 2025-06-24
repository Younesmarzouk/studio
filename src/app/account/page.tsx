
"use client"

import * as React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Award, Briefcase, Building, MapPin, Pencil, GalleryHorizontal, List } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Job } from '@/lib/data';
import JobCard from '@/components/job-card';

const AccountPageSkeleton = () => (
    <div>
        <PageHeader title="حسابي الشخصي" />
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden mb-6">
                <Skeleton className="h-32 w-full" />
                <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6 -mt-16">
                    <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
                    <div className="flex-grow space-y-2 text-center md:text-right">
                        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                        <Skeleton className="h-5 w-64 mx-auto md:mx-0" />
                        <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-16 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-32 w-full" /></CardContent></Card>
                </div>
                <div className="space-y-6">
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-12 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-16 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    </div>
);


export default function AccountPage() {
    const [user, setUser] = React.useState<UserProfile | null>(null);
    const [myAds, setMyAds] = React.useState<Job[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                try {
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUser(docSnap.data() as UserProfile);
                    } else {
                        console.error("User document not found in Firestore, but user exists in Auth.");
                    }

                    // Fetch user's ads
                    const adsCollection = collection(db, 'ads');
                    // Query by userId only to avoid composite index. We'll sort on the client.
                    const adsQuery = query(adsCollection, where('userId', '==', firebaseUser.uid));
                    const adsSnapshot = await getDocs(adsQuery);
                    const fetchedAds = adsSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            title: data.title,
                            city: data.city,
                            price: data.price,
                            rating: data.rating || 4.5,
                            featured: data.featured || false,
                            icon: data.category || 'Hammer',
                            workType: data.workType,
                            createdAt: data.createdAt, // For sorting
                        } as Job & { createdAt: any };
                    });

                    // Sort ads by creation date on the client-side
                    fetchedAds.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

                    setMyAds(fetchedAds);

                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUser(null);
                setMyAds([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <AccountPageSkeleton />;
    }

    if (!user) {
        return (
            <div>
                <PageHeader title="حسابي الشخصي" />
                <div className="p-8 text-center flex flex-col items-center justify-center h-[50vh]">
                    <p className="text-lg text-muted-foreground">الرجاء تسجيل الدخول لعرض ملفك الشخصي.</p>
                    <Link href="/login" passHref>
                        <Button className="mt-4">تسجيل الدخول</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="حسابي الشخصي" />
            <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-background">
                
                <Card className="overflow-hidden mb-6 shadow-md">
                    <CardHeader className="p-0">
                        <div className="bg-muted h-32" />
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6 -mt-16">
                        <div className="relative">
                            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Link href="/account/edit" passHref>
                                <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-grow text-center md:text-right">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.title}</p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1 text-sm">
                                <MapPin className="h-4 w-4" />
                                <span>{user.location}</span>
                            </div>
                        </div>
                        <div className="flex-shrink-0 mt-4 md:mt-0">
                            <Link href="/account/edit" passHref>
                                <Button>
                                    <Pencil className="ml-2 h-4 w-4" />
                                    تعديل الملف الشخصي
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="text-primary" /> نبذة عني</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{user.bio || "لا توجد نبذة شخصية."}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {user.skills?.map((skill, index) => <Badge key={`${skill}-${index}`} variant="secondary">{skill}</Badge>)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Briefcase className="text-primary" /> الخبرة العملية</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.experience?.length > 0 ? user.experience.map((exp, i) => (
                                    <React.Fragment key={`${exp.title}-${i}`}>
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                                <Building className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{exp.title}</h4>
                                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                                                <p className="text-xs text-muted-foreground">{exp.period}</p>
                                            </div>
                                        </div>
                                        {i < user.experience.length - 1 && <Separator />}
                                    </React.Fragment>
                                )) : <p className="text-muted-foreground">لا توجد خبرة مضافة.</p>}
                            </CardContent>
                        </Card>
                         
                         <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><List className="text-primary" /> إعلاناتي</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {myAds.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {myAds.map(ad => (
                                            <JobCard key={ad.id} job={ad} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">لم تقم بنشر أي إعلانات بعد.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><GalleryHorizontal className="text-primary" /> معرض الأعمال</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {user.portfolio?.length > 0 ? user.portfolio.map((item, i) => (
                                    <Image key={`${item.src}-${i}`} src={item.src} alt={`Portfolio item ${i+1}`} width={200} height={150} className="rounded-lg object-cover aspect-[4/3] hover:opacity-80 transition-opacity" data-ai-hint={item.hint} />
                                )) : <p className="text-muted-foreground col-span-full">لا يوجد معرض أعمال.</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle>معلومات التواصل</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground"/>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground"/>
                                    <span>{user.phone || "لم يتم إضافة رقم هاتف"}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Award className="text-primary" /> الشهادات</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {user.certifications?.length > 0 ? user.certifications.map((cert, i) => (
                                <div key={`${cert.name}-${i}`}>
                                        <p className="font-semibold">{cert.name}</p>
                                        <p className="text-sm text-muted-foreground">{cert.authority} - {cert.year}</p>
                                </div>
                                )) : <p className="text-muted-foreground">لا توجد شهادات مضافة.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}
