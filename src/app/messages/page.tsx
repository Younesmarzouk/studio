import PageHeader from '@/components/page-header';

export default function DeprecatedPage() {
  return (
    <div>
      <PageHeader title="صفحة غير مستخدمة" />
      <div className="p-8 text-center">
        <p>هذه الصفحة لم تعد جزءاً من التطبيق.</p>
      </div>
    </div>
  );
}
