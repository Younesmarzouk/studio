
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type FieldErrors } from "react-hook-form"
import * as z from "zod"
import * as React from "react"
import { useRouter, useParams, notFound } from "next/navigation"
import type { User as FirebaseUser } from "firebase/auth"
import Link from "next/link"

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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, ChevronLeft, Pencil } from "lucide-react"
import PageHeader from "@/components/page-header"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { professions } from "@/lib/professions"

const formSchema = z.object({
  title: z.string().min(5, "يجب أن يكون العنوان 5 أحرف على الأقل.").max(50, "يجب أن يكون العنوان 50 حرفًا على الأكثر."),
  category: z.string({ required_error: "الرجاء اختيار فئة." }).min(1, { message: "الرجاء اختيار فئة." }),
  description: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل.").max(500, "يجب أن يكون الوصف 500 حرف على الأكثر."),
  city: z.string().min(2, "يجب إدخال اسم المدينة."),
  price: z.string().optional(),
  workType: z.enum(["daily", "part-time", "seasonal", "full-time"], {
    required_error: "الرجاء تحديد طبيعة العمل.",
  }),
})

type FormValues = z.infer<typeof formSchema>;

const EditAdSkeleton = () => (
    <div>
        <PageHeader title="تعديل الإعلان" icon={<Pencil className="h-6 w-6" />} />
        <div className="p-4 max-w-2xl mx-auto">
            <Skeleton className="h-6 w-40 mb-4" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-24 w-full" /></div>
                    <div className="grid grid-cols-2 gap-8"><div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div><div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="flex justify-end gap-2 pt-4"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-32" /></div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default function EditAdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  
  const [user, authLoading, authError] = useAuthState(auth);
  const [ad, setAd] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchAd = async () => {
      try {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const adData = docSnap.data();
          if (adData.userId !== user.uid) {
             toast({ variant: "destructive", title: "غير مصرح به", description: "لا يمكنك تعديل هذا الإعلان." });
             router.replace('/account');
             return;
          }
          setAd(adData);
          form.reset({
            title: adData.title,
            category: adData.category,
            description: adData.description,
            city: adData.city,
            price: adData.price || "",
            workType: adData.workType,
          });
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching ad:", error);
        toast({ variant: "destructive", title: "خطأ", description: "فشل في جلب بيانات الإعلان." });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAd();
  }, [id, user, authLoading, router, toast, form]);

  async function onSubmit(values: FormValues) {
    if (!user || !ad) return;

    setIsSubmitting(true);
    toast({ title: "جاري تحديث إعلانك..." });

    try {
      const adDocRef = doc(db, 'ads', id);
      await updateDoc(adDocRef, {
        ...values
      });
      
      toast({
          title: "تم تحديث إعلانك بنجاح!",
          description: "تم حفظ التغييرات.",
      });
      router.push('/account');

    } catch (error: any) {
      console.error("Error updating ad:", error);
      toast({
          variant: "destructive",
          title: "فشل تحديث الإعلان",
          description: "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const onInvalid = (errors: FieldErrors) => {
    console.error("Form validation failed:", errors)
    toast({
      variant: "destructive",
      title: "بيانات غير مكتملة",
      description: "الرجاء التأكد من ملء جميع الحقول المطلوبة بشكل صحيح.",
    })
  }

  if (loading || authLoading) {
    return <EditAdSkeleton />;
  }
  
  return (
    <div>
      <PageHeader title="تعديل الإعلان" icon={<Pencil className="h-6 w-6" />} />
      <div className="p-4 max-w-2xl mx-auto">
         <Link href="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            العودة إلى حسابي
        </Link>
        <Card>
           <CardHeader>
                <CardTitle>تعديل معلومات الإعلان</CardTitle>
           </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان الإعلان</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: نجار محترف للأثاث" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الفئة / الحرفة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة الخدمة" />
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
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف الخدمة</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="اكتب تفاصيل عن الخدمة التي تقدمها أو تبحث عنها..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: الدار البيضاء" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر / الأجرة (اختياري)</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 200 درهم/اليوم أو حسب الخدمة" {...field} />
                        </FormControl>
                        <FormDescription>
                          يمكنك ترك هذا الحقل فارغاً.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="workType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>طبيعة العمل</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr"><FormControl><RadioGroupItem value="daily" /></FormControl><FormLabel className="font-normal">يومي</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr"><FormControl><RadioGroupItem value="part-time" /></FormControl><FormLabel className="font-normal">دوام جزئي</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr"><FormControl><RadioGroupItem value="seasonal" /></FormControl><FormLabel className="font-normal">موسمي</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr"><FormControl><RadioGroupItem value="full-time" /></FormControl><FormLabel className="font-normal">دوام كامل</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Link href="/account">
                        <Button variant="outline" type="button" disabled={isSubmitting}>إلغاء</Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...</>
                        ) : (
                           <><Save className="ml-2 h-4 w-4" /> حفظ التغييرات</>
                        )}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
