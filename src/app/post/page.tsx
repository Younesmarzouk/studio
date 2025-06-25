
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type FieldErrors } from "react-hook-form"
import * as z from "zod"
import * as React from "react"
import { useRouter } from "next/navigation"
import type { User } from "firebase/auth"

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
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, UserPlus, Loader2, Clock, Phone } from "lucide-react"
import PageHeader from "@/components/page-header"
import { auth, db } from "@/lib/firebase"
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { professions } from "@/lib/professions"

const formSchema = z.object({
  type: z.enum(["job", "worker"], {
    required_error: "يجب اختيار نوع الإعلان.",
  }),
  title: z.string().min(5, "يجب أن يكون العنوان 5 أحرف على الأقل.").max(50, "يجب أن يكون العنوان 50 حرفًا على الأكثر."),
  category: z.string({ required_error: "الرجاء اختيار فئة." }).min(1, { message: "الرجاء اختيار فئة." }),
  description: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل.").max(500, "يجب أن يكون الوصف 500 حرف على الأكثر."),
  city: z.string().min(2, "يجب إدخال اسم المدينة."),
  price: z.string().optional(),
  userPhone: z.string().min(10, { message: "الرجاء إدخال رقم هاتف صحيح." }),
  workType: z.enum(["daily", "part-time", "seasonal", "full-time"], {
    required_error: "الرجاء تحديد طبيعة العمل.",
  }),
})

type FormValues = z.infer<typeof formSchema>;

export default function PostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'job',
      title: '',
      category: '',
      description: '',
      city: '',
      price: '',
      userPhone: '',
      workType: 'daily',
    },
  })
  
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
             const userDocRef = doc(db, 'users', currentUser.uid);
             const userDocSnap = await getDoc(userDocRef);
             if (userDocSnap.exists()) {
                 const userData = userDocSnap.data();
                 form.setValue('city', userData.location && userData.location !== 'غير محدد' ? userData.location : '');
                 form.setValue('userPhone', userData.phone || '');
             }
        } else {
            toast({
                variant: "destructive",
                title: "الوصول مرفوض",
                description: "الرجاء تسجيل الدخول للمتابعة.",
            });
            router.replace('/login');
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, [router, toast, form]);


  async function onSubmit(values: FormValues) {
    if (!user || !user.email) {
        toast({
            variant: "destructive",
            title: "يجب تسجيل الدخول أولاً",
            description: "الرجاء تسجيل الدخول لنشر إعلان.",
        });
        return router.replace("/login");
    }

    setIsSubmitting(true);
    toast({ title: "جاري نشر إعلانك..." });

    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
             throw new Error("لم يتم العثور على ملف المستخدم. لا يمكن إنشاء الإعلان.");
        }
        const userData = userDocSnap.data();

        await addDoc(collection(db, "ads"), {
            userId: user.uid,
            userName: userData.name,
            userPhone: values.userPhone,
            userAvatar: userData.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${user.email}`,
            type: values.type,
            title: values.title,
            category: values.category,
            description: values.description,
            city: values.city,
            price: values.price || "",
            workType: values.workType,
            createdAt: serverTimestamp(),
            featured: false,
            rating: 0,
        });
        
        toast({
            title: "تم نشر إعلانك بنجاح!",
            description: "يمكنك الآن رؤيته في ملفك الشخصي.",
        });
        form.reset();
        router.push('/account');

    } catch (error: any) {
        console.error("Detailed error posting ad: ", error);
        
        let description = "حدث خطأ غير متوقع أثناء الحفظ.";
        if (error.code === 'permission-denied') {
            description = "فشل حفظ بيانات الإعلان بسبب عدم وجود صلاحيات كافية في Firestore. يرجى مراجعة قواعد الأمان.";
        } else if (error.message) {
            description = error.message;
        }

        toast({
            variant: "destructive",
            title: "فشل نشر الإعلان",
            description: description,
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
  
  if (loading) {
    return (
        <div>
            <PageHeader title="نشر إعلان جديد" />
            <div className="p-4 max-w-2xl mx-auto">
                <Card>
                    <CardContent className="pt-6 space-y-8">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full mt-8" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div>
      <PageHeader title="نشر إعلان جديد" />
      <div className="p-4 max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>ماذا تريد أن تعلن؟</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr">
                            <FormControl>
                              <RadioGroupItem value="job" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <Briefcase className="h-5 w-5" /> أبحث عن عامل (عرض عمل)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr">
                            <FormControl>
                              <RadioGroupItem value="worker" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <UserPlus className="h-5 w-5" /> أبحث عن عمل (عامل)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
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
                  name="userPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4"/> رقم هاتف التواصل</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="مثال: 0612345678" {...field} />
                      </FormControl>
                      <FormDescription>
                        سيتم عرض هذا الرقم في الإعلان للتواصل معك.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center gap-2"><Clock className="h-4 w-4"/> طبيعة العمل</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr">
                            <FormControl><RadioGroupItem value="daily" /></FormControl>
                            <FormLabel className="font-normal">يومي</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr">
                            <FormControl><RadioGroupItem value="part-time" /></FormControl>
                            <FormLabel className="font-normal">دوام جزئي</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr">
                            <FormControl><RadioGroupItem value="seasonal" /></FormControl>
                            <FormLabel className="font-normal">موسمي</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0" dir="ltr">
                            <FormControl><RadioGroupItem value="full-time" /></FormControl>
                            <FormLabel className="font-normal">دوام كامل</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                   {isSubmitting ? (
                        <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري النشر...
                        </>
                    ) : (
                       "نشر الإعلان"
                    )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )

    