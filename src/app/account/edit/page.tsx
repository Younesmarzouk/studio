"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { User, Briefcase, MapPin, Mail, Phone, Save, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const user = {
    name: 'أحمد العلوي',
    avatar: 'https://placehold.co/128x128.png',
    title: 'نجار محترف وخبير أثاث',
    location: 'الدار البيضاء, المغرب',
    email: 'ahmed.alaoui@example.com',
    phone: '+212 6 00 00 00 00',
    bio: 'نجار بخبرة تزيد عن 15 عامًا في تصميم وتصنيع الأثاث المخصص. أسعى دائمًا لتقديم أعلى جودة وحرفية في كل قطعة أقوم بصنعها.',
    skills: ['تصنيع أثاث', 'تركيب مطابخ', 'إصلاحات خشبية', 'تصميم حسب الطلب', 'دهان وتشطيب'],
};

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل." }),
  title: z.string().min(5, { message: "يجب أن يكون المسمى الوظيفي 5 أحرف على الأقل." }),
  location: z.string().min(2, { message: "يجب إدخال الموقع." }),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }),
  phone: z.string().min(10, { message: "الرجاء إدخال رقم هاتف صحيح." }),
  bio: z.string().min(10, { message: "يجب أن تكون النبذة 10 أحرف على الأقل." }).max(300),
  skills: z.string(), // For simplicity, a comma-separated string
  avatar: z.any().optional(),
})

export default function EditAccountPage() {
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      title: user.title,
      location: user.location,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      skills: user.skills.join(', '),
    },
  })

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log(values)
    toast({
      title: "تم تحديث الملف الشخصي!",
      description: "تم حفظ تغييراتك بنجاح.",
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto bg-background">
       <Link href="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            العودة إلى الملف الشخصي
        </Link>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>تعديل الملف الشخصي</CardTitle>
          <CardDescription>قم بتحديث معلوماتك الشخصية والمهنية هنا.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصورة الشخصية</FormLabel>
                    <FormControl>
                       <div className="flex items-center gap-4">
                         <Image src={user.avatar} alt="Avatar" width={96} height={96} className="w-24 h-24 rounded-full object-cover" data-ai-hint="person face" />
                         <Input id="avatar-upload" type="file" className="max-w-xs" onChange={(e) => field.onChange(e.target.files?.[0])} />
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <FormLabel className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> المسمى الوظيفي</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                        {form.getValues('skills').split(',').map(skill => skill.trim() && <Badge key={skill} variant="secondary">{skill.trim()}</Badge>)}
                     </div>
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
                                <Input type="email" {...field} />
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
                    <Button variant="outline" type="button">إلغاء</Button>
                </Link>
                <Button type="submit">
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التغييرات
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
