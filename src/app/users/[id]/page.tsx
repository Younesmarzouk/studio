
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
import { Skeleton } from "@/components/ui/skeleton";
import type { UserProfile } from '@/lib/types';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Job } from '@/lib/data';
import JobCard from '@/components/job-card';
import WorkerCard from '@/components/worker-card';
import { useParams, notFound } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

const UserPageSkeleton = () => (
    <div>
        <PageHeader title="ملف شخصي" icon={<User className="h-6 w-6" />} showBackButton />
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
                </div>
                <div className="space-y-6">
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-12 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    </div>
);


export default function UserPage() {
    const params = useParams();
    const userId = params.id as string;
    
    const [loggedInUser, authLoading] = useAuthState(auth);
    
    const [profileUser, setProfileUser] = React.useState<UserProfile | null>(null);
    const [userAds, setUserAds] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setProfileUser({uid: userDocSnap.id, ...userDocSnap.data()} as UserProfile);
                } else {
                    console.error("User not found");
                    setProfileUser(null);
                }

                const adsCollection = collection(db, 'ads');
                const adsQuery = query(adsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
                const adsSnapshot = await getDocs(adsQuery);
                const fetchedAds = adsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        icon: data.category || 'other',
                        rating: data.rating || 4.5,
                    };
                });
                
                setUserAds(fetchedAds);

            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading || authLoading) {
        return <UserPageSkeleton />;
    }
    
    if (!profileUser) {
        return notFound();
    }
    
    const isOwnProfile = loggedInUser && loggedInUser.uid === userId;

    return (
        <div>
            <PageHeader title={`ملف ${profileUser.name}`} icon={<User className="h-6 w-6" />} showBackButton />
            <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-background">
                
                <Card className="overflow-hidden mb-6 shadow-md">
                    <CardHeader className="p-0">
                        <div className="bg-muted h-32" />
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6 -mt-16">
                        <div className="relative">
                            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                                <AvatarImage src={profileUser.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${profileUser.email}`} alt={profileUser.name} data-ai-hint="person face" />
                                <AvatarFallback>{profileUser.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-grow text-center md:text-right">
                            <h2 className="text-2xl font-bold">{profileUser.name}</h2>
                            <p className="text-muted-foreground">{profileUser.title}</p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1 text-sm">
                                <MapPin className="h-4 w-4" />
                                <span>{profileUser.location}</span>
                            </div>
                        </div>
                        <div className="flex-shrink-0 mt-4 md:mt-0">
                            {isOwnProfile ? (
                                <Link href="/account/edit" passHref>
                                    <Button>
                                        <Pencil className="ml-2 h-4 w-4" />
                                        تعديل الملف الشخصي
                                    </Button>
                                </Link>
                            ) : (
                                profileUser.phone ? (
                                    <Button asChild>
                                        <a href={`tel:${profileUser.phone}`}>
                                            <Phone className="ml-2 h-4 w-4" />
                                            اتصال
                                        </a>
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled>لا يوجد رقم هاتف</Button>
                                )
                            )}
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
                                <p className="text-muted-foreground leading-relaxed">{profileUser.bio || "لا توجد نبذة شخصية."}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {profileUser.skills?.map((skill, index) => <Badge key={index} variant="secondary">{skill}</Badge>)}
                                </div>
                            </CardContent>
                        </Card>

                         <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><List className="text-primary" /> إعلانات المستخدم</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {userAds.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {userAds.map(ad => (
                                           <div key={ad.id}>
                                                {ad.type === 'worker' ? (
                                                    <WorkerCard worker={ad} />
                                                ) : (
                                                    <JobCard job={ad} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">لم يقم هذا المستخدم بنشر أي إعلانات بعد.</p>
                                )}
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
                                    <span>{profileUser.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground"/>
                                    <span>{profileUser.phone || "لم يتم إضافة رقم هاتف"}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}
