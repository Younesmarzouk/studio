"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import * as React from "react"
import Image from "next/image"
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
import { Briefcase, UserPlus, Upload } from "lucide-react"
import PageHeader from "@/components/page-header"
import { auth, db, storage } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { onAuthStateChanged } from "firebase/auth"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  type: z.enum(["job", "worker"], {
    required_error: "يجب اختيار نوع الإعلان.",
  }),
  title: z.string().min(5, "يجب أن يكون العنوان 5 أحرف على الأقل.").max(50, "يجب أن يكون العنوان 50 حرفًا على الأكثر."),
  category: z.string({
    required_error: "الرجاء اختيار فئة.",
  }),
  description: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل.").max(500, "يجب أن يكون الوصف 500 حرف على الأكثر."),
  city: z.string().min(2, "يجب إدخال اسم المدينة."),
  price: z.string().optional(),
  image: z.any().optional(),
})

export default function PostPage() {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "job",
      title: "",
      description: "",
      city: "",
    },
  })
  
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
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
  }, [router, toast]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "يجب تسجيل الدخول أولاً",
            description: "الرجاء تسجيل الدخول لنشر إعلان.",
        });
        return router.replace("/login");
    }

    toast({ title: "جاري نشر إعلانك..." });

    let imageUrl = "";
    if (values.image && values.image instanceof File) {
        const file = values.image as File;
        const storageRef = ref(storage, `ads/${user.uid}/${Date.now()}_${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Error uploading image: ", error);
            toast({
                variant: "destructive",
                title: "فشل رفع الصورة",
                description: "حدث خطأ أثناء محاولة رفع الصورة. حاول مرة أخرى.",
            });
            return;
        }
    }

    try {
        await addDoc(collection(db, "ads"), {
            userId: user.uid,
            type: values.type,
            title: values.title,
            category: values.category,
            description: values.description,
            city: values.city,
            price: values.price || "",
            imageUrl: imageUrl,
            createdAt: serverTimestamp(),
        });
        
        toast({
            title: "تم نشر إعلانك بنجاح!",
            description: "سيتم مراجعته ونشره في أقرب وقت.",
        });
        form.reset();
        setImagePreview(null);
        router.push('/jobs');
    } catch (error) {
        console.error("Error posting ad: ", error);
        toast({
            variant: "destructive",
            title: "فشل نشر الإعلان",
            description: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
        });
    }
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
                        <Skeleton className="h-48 w-full" />
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <FormLabel>الفئة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة الخدمة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="carpentry">نجارة</SelectItem>
                          <SelectItem value="electricity">كهرباء</SelectItem>
                          <SelectItem value="plumbing">سباكة</SelectItem>
                          <SelectItem value="design">تصميم</SelectItem>
                          <SelectItem value="development">برمجة وتطوير</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
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
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel>إضافة صورة (اختياري)</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="dropzone-file" className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                              {imagePreview ? (
                                <Image src={imagePreview} alt="Image Preview" fill className="object-contain rounded-lg p-2" />
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">انقر للتحميل</span> أو اسحب وأفلت</p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG</p>
                                </div>
                              )}
                              <Input id="dropzone-file" type="file" className="hidden" 
                                {...rest}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                    setImagePreview(URL.createObjectURL(file));
                                  } else {
                                    onChange(null);
                                    setImagePreview(null);
                                  }
                              }}
                              />
                          </label>
                        </div> 
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

                <Button type="submit" className="w-full">نشر الإعلان</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
