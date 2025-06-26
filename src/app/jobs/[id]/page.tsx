
import { redirect } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/page-header';
import { FileText } from 'lucide-react';

/**
 * This page handles legacy ID-based URLs and permanently redirects them
 * to the new SEO-friendly slug-based URLs.
 */
export default async function JobIdRedirectPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    redirect('/jobs');
  }
  
  try {
    const docRef = doc(db, 'ads', params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const slug = docSnap.data().slug;
      if (slug) {
        redirect(`/jobs/${slug}`);
      }
    }
  } catch (e) {
    // If there's an error (e.g., invalid ID), redirect to the main list.
    console.error("Redirect failed for ID:", params.id, e);
  }

  // Fallback redirect in case of any issue
  redirect('/jobs');

  // Note: The content below is for display while the redirect is processed by the browser,
  // but the redirect should be nearly instantaneous.
  return (
      <div>
        <PageHeader title="تفاصيل الإعلان" icon={<FileText className="h-6 w-6" />} showBackButton />
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
                <p>جاري إعادة التوجيه...</p>
            </div>
        </div>
      </div>
  );
}
