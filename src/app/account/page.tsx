import * as React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Award, Briefcase, Building, MapPin, Pencil, GalleryHorizontal } from 'lucide-react';
import Link from 'next/link';

const user = {
    name: 'أحمد العلوي',
    avatar: 'https://placehold.co/128x128.png',
    title: 'نجار محترف وخبير أثاث',
    location: 'الدار البيضاء, المغرب',
    email: 'ahmed.alaoui@example.com',
    phone: '+212 6 00 00 00 00',
    bio: 'نجار بخبرة تزيد عن 15 عامًا في تصميم وتصنيع الأثاث المخصص. أسعى دائمًا لتقديم أعلى جودة وحرفية في كل قطعة أقوم بصنعها.',
    skills: ['تصنيع أثاث', 'تركيب مطابخ', 'إصلاحات خشبية', 'تصميم حسب الطلب', 'دهان وتشطيب'],
    experience: [
        { title: 'نجار أول', company: 'ورشة النجارة العصرية', period: '2015 - الآن' },
        { title: 'مساعد نجار', company: 'ورشة الأمانة', period: '2010 - 2015' },
    ],
    certifications: [
        { name: 'شهادة حرفي معتمد', authority: 'غرفة الصناعة التقليدية', year: '2012' },
        { name: 'دورة تصميم الأثاث', authority: 'معهد الفنون التطبيقية', year: '2014' },
    ],
    portfolio: [
        { src: 'https://placehold.co/600x400.png', hint: 'custom furniture' },
        { src: 'https://placehold.co/600x400.png', hint: 'kitchen cabinets' },
        { src: 'https://placehold.co/600x400.png', hint: 'wooden door' },
        { src: 'https://placehold.co/600x400.png', hint: 'wardrobe design' },
    ]
};

export default function AccountPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-background">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">حسابي الشخصي</h1>
            
            <Card className="overflow-hidden mb-6 shadow-md">
                <CardHeader className="p-0">
                    <div className="bg-muted h-32" />
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6 -mt-16">
                    <div className="relative">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                         <Button size="icon" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                            <Pencil className="h-4 w-4" />
                        </Button>
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
                            <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {user.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase className="text-primary" /> الخبرة العملية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.experience.map((exp, i) => (
                                <React.Fragment key={i}>
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
                            ))}
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><GalleryHorizontal className="text-primary" /> معرض الأعمال</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                               {user.portfolio.map((item, i) => (
                                   <Image key={i} src={item.src} alt={`Portfolio item ${i+1}`} width={200} height={150} className="rounded-lg object-cover aspect-[4/3] hover:opacity-80 transition-opacity" data-ai-hint={item.hint} />
                               ))}
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
                                <span>{user.phone}</span>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Award className="text-primary" /> الشهادات</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {user.certifications.map((cert, i) => (
                               <div key={i}>
                                    <p className="font-semibold">{cert.name}</p>
                                    <p className="text-sm text-muted-foreground">{cert.authority} - {cert.year}</p>
                               </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}
