
"use client"
import PageHeader from '@/components/page-header';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader title="الرسائل" icon={<MessageSquare className="h-8 w-8" />} />
      <div className="flex justify-center items-center h-64 border rounded-lg bg-card">
        <p className="text-muted-foreground">صفحة الرسائل قيد الإنشاء.</p>
      </div>
    </div>
  );
}
