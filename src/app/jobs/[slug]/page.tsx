
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Ad } from '@/lib/data';
import JobDetailsClient from './job-details-client';

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const adsCollection = collection(db, 'ads');
    const q = query(adsCollection, where('type', '==', 'job'));
    const adsSnapshot = await getDocs(q);
    const slugs = adsSnapshot.docs.map(doc => ({
      slug: doc.data().slug || doc.id,
    }));
    return slugs;
  } catch (error) {
    console.error("Error generating static params for jobs:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  const q = query(collection(db, 'ads'), where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return {
      title: 'Job Not Found',
      description: 'This job listing may have been moved or deleted.',
    };
  }

  const job = querySnapshot.docs[0].data();
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

async function getJob(slug: string): Promise<Ad | null> {
  try {
    const q = query(collection(db, 'ads'), where('slug', '==', slug), limit(1));
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


export default async function JobSlugPage({ params }: Props) {
  const job = await getJob(params.slug);

  if (!job) {
    notFound();
  }

  return <JobDetailsClient job={job} />;
}
