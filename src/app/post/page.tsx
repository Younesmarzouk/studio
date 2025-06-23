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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, UserPlus } from "lucide-react"

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
})

export default function PostPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "job",
      title: "",
      description: "",
      city: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "تم إرسال إعلانك بنجاح!",
      description: "سيتم مراجعته ونشره في أقرب وقت.",
    })
    form.reset();
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">نشر إعلان جديد</CardTitle>
        </CardHeader>
        <CardContent>
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
  )
}
