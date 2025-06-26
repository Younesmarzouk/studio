
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Ad } from '@/lib/data';
import JobDetailsClient from './job-details-client';

type Props = {
  params: { slug: string }
}

// Helper to check if a string could be a Firestore ID
function isFirestoreId(id: string): boolean {
  return /^[a-zA-Z0-9]{20}$/.test(id);
}

// Fetches an ad by its slug
async function getJobBySlug(slug: string): Promise<Ad | null> {
  try {
    const q = query(collection(db, 'ads'), where('slug', '==', slug), where('type', '==', 'job'), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    const adDoc = snapshot.docs[0];
    const data = adDoc.data();

    let adData = { id: adDoc.id, ...data } as Ad;
          
    if (data.userId) {
      const userRef = doc(db, 'users', data.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
          const userData = userSnap.data();
          adData = {
              ...adData,
              userName: userData.name,
              userAvatar: userData.avatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${userData.email}`,
          };
      }
    }
    return adData;
  } catch (error) {
    console.error(`Error fetching job with slug ${slug}:`, error);
    return null;
  }
}

// Fetches an ad by its ID
async function getJobById(id: string): Promise<Ad | null> {
    try {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().type === 'job') {
            return { id: docSnap.id, ...docSnap.data() } as Ad;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching job with id ${id}:`, error);
        return null;
    }
}

export async function generateStaticParams() {
  try {
    const adsCollection = collection(db, 'ads');
    const q = query(adsCollection, where('type', '==', 'job'));
    const adsSnapshot = await getDocs(q);
    return adsSnapshot.docs
      .map(doc => ({ slug: doc.data().slug }))
      .filter(item => !!item.slug); // Filter out ads without slugs
  } catch (error) {
    console.error("Error generating static params for jobs:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  
  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'This job listing may have been moved or deleted.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  
  return {
    title: `${job.title} في ${job.city}`,
    description: job.description.substring(0, 160),
    openGraph: {
      title: `${job.title} في ${job.city} | ZafayLink`,
      description: job.description.substring(0, 160),
      images: ['/og-image.png', ...previousImages],
    },
  };
}


export default async function JobSlugPage({ params }: Props) {
  const slugOrId = params.slug;
  
  // 1. Try to fetch the job by slug. This is the primary and most common path.
  let job = await getJobBySlug(slugOrId);

  if (job) {
    // If found, render the page with the job details.
    return <JobDetailsClient job={job} />;
  }

  // 2. If not found by slug, it might be a legacy ID-based URL.
  // Check if the parameter looks like a Firestore ID.
  if (isFirestoreId(slugOrId)) {
    const jobById = await getJobById(slugOrId);
    // If we found a job by ID and it has a slug, redirect to the correct SEO-friendly URL.
    if (jobById && jobById.slug) {
      return redirect(`/jobs/${jobById.slug}`);
    }
  }

  // 3. If we've reached this point, the slug is invalid and it's not a redirectable ID.
  // Therefore, show the 404 page.
  notFound();
}
