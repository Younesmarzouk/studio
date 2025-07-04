
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, Briefcase, MapPin, Mail, Phone, Save, Loader2, Award, Pencil } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import * as React from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User as FirebaseUser } from 'firebase/auth';
import { Skeleton } from "@/components/ui/skeleton"
import { professions } from "@/lib/professions"
import PageHeader from "@/components/page-header"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل." }),
  title: z.string({ required_error: "الرجاء اختيار حرفتك أو مهنتك." }).min(1, { message: "الرجاء اختيار حرفتك أو مهنتك." }),
  location: z.string().min(2, { message: "يجب إدخال الموقع." }),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  phone: z.string().min(10, { message: "الرجاء إدخال رقم هاتف صحيح." }),
  bio: z.string().min(10, { message: "يجب أن تكون النبذة 10 أحرف على الأقل." }).max(300, "يجب ألا تتجاوز النبذة 300 حرف."),
  skills: z.string(),
  certifications: z.string().max(1000, "النص طويل جداً").optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const EditPageSkeleton = () => (
    <div>
        <PageHeader title="تعديل الملف الشخصي" icon={<Pencil className="h-6 w-6" />} showBackButton />
        <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                     <Card>
                        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-2 pt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default function EditAccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '', title: '', location: '', email: '', phone: '', bio: '', skills: '', certifications: '',
    },
  })

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                form.reset({
                    name: userData.name || '',
                    title: userData.title || '',
                    location: userData.location || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    bio: userData.bio || '',
                    skills: (userData.skills || []).join(', '),
                    certifications: (userData.certifications || []).map((c: any) => `${c.name}, ${c.authority}, ${c.year}`).join('\n'),
                });
                setAvatarUrl(userData.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${userData.email}`);
            }
        } else {
            router.replace('/login');
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, [form, router]);


  async function onSubmit(values: ProfileFormValues) {
    if (!user) return;
    setIsSubmitting(true);

    try {
        const userDocRef = doc(db, 'users', user.uid);
        
        const certifications = values.certifications?.split('\n').filter(Boolean).map(line => {
            const [name = '', authority = '', year = ''] = line.split(',').map(s => s.trim());
            return { name, authority, year };
        }) || [];

        await updateDoc(userDocRef, {
            name: values.name,
            title: values.title,
            location: values.location,
            email: values.email,
            phone: values.phone,
            bio: values.bio,
            skills: values.skills.split(',').map(s => s.trim()).filter(Boolean),
            certifications: certifications,
        });

        toast({
          title: "تم تحديث الملف الشخصي!",
          description: "تم حفظ تغييراتك بنجاح.",
        })
        router.push('/account');
    } catch (error: any) {
        console.error("Detailed error updating profile:", error);
        let description = "فشل تحديث الملف الشخصي. الرجاء المحاولة مرة أخرى.";
        if (error.code === 'permission-denied') {
            description = "فشل حفظ البيانات بسبب قواعد الأمان في Firestore. يرجى مراجعتها.";
        } else if (error.message) {
            description = error.message;
        }
        toast({
            variant: 'destructive',
            title: 'خطأ',
            description: description,
        })
    } finally {
        setIsSubmitting(false);
    }
  }
  
  if (loading) {
    return <EditPageSkeleton />;
  }

  return (
    <>
    <PageHeader title="تعديل الملف الشخصي" icon={<Pencil className="h-6 w-6" />} showBackButton />
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto bg-background">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>تحديث معلوماتك</CardTitle>
          <CardDescription>قم بتحديث معلوماتك الشخصية والمهنية هنا.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormItem>
                <FormLabel>الصورة الرمزية</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-4">
                    {avatarUrl && <Image 
                        src={avatarUrl} 
                        alt="Avatar" 
                        width={96} 
                        height={96} 
                        className="w-24 h-24 rounded-full object-cover" 
                        data-ai-hint="person face" />}
                    <p className="text-sm text-muted-foreground">يتم تعيين الصور الرمزية تلقائيًا ولا يمكن تغييرها.</p>
                    </div>
                </FormControl>
              </FormItem>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><User className="h-4 w-4" /> الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> الحرفة أو المهنة</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر حرفتك أو مهنتك" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {professions.map(prof => (
                            <SelectItem key={prof.value} value={prof.value}>{prof.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4" /> الموقع</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نبذة عني</FormLabel>
                    <FormControl>
                      <Textarea placeholder="تحدث عن خبراتك ومهاراتك..." className="resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المهارات</FormLabel>
                    <FormControl>
                      <Input placeholder="فصل بين المهارات بفاصلة, مثل: نجارة, تصميم" {...field} />
                    </FormControl>
                     <div className="flex flex-wrap gap-2 pt-2">
                        {form.watch('skills').split(',').map((skill, index) => skill.trim() && <Badge key={`${skill.trim()}-${index}`} variant="secondary">{skill.trim()}</Badge>)}
                     </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Award className="h-4 w-4" /> الشهادات والمؤهلات</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="اكتب كل شهادة في سطر منفصل، مع الفصل بفاصلة بين الاسم والجهة والسنة."
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      مثال: شهادة تحليل بيانات, جوجل, 2023
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card>
                <CardHeader>
                    <CardTitle className="text-lg">معلومات التواصل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4" /> البريد الإلكتروني</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4" /> رقم الهاتف</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4">
                <Link href="/account">
                    <Button variant="outline" type="button" disabled={isSubmitting}>إلغاء</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : (
                       <>
                         <Save className="ml-2 h-4 w-4" />
                         حفظ التغييرات
                       </>
                    )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
