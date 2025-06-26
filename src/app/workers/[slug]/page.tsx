
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Ad } from '@/lib/data';
import WorkerDetailsClient from './worker-details-client';

type Props = {
  params: { slug: string }
}

function isFirestoreId(id: string): boolean {
  // A simple check for a string that looks like a Firestore ID.
  return /^[a-zA-Z0-9]{20}$/.test(id);
}

export async function generateStaticParams() {
  try {
    const adsCollection = collection(db, 'ads');
    const q = query(adsCollection, where('type', '==', 'worker'));
    const adsSnapshot = await getDocs(q);
    const slugs = adsSnapshot.docs.map(doc => ({
      slug: doc.data().slug || doc.id,
    }));
    return slugs;
  } catch (error) {
    console.error("Error generating static params for workers:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  // Metadata is only generated for valid slugs. ID-based URLs will redirect.
  const q = query(collection(db, 'ads'), where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return {
      title: 'Worker Not Found',
      description: 'This worker profile may have been moved or deleted.',
    };
  }

  const ad = querySnapshot.docs[0].data();
  const previousImages = (await parent).openGraph?.images || [];
  
  return {
    title: `${ad.title} في ${ad.city}`,
    description: ad.description.substring(0, 160),
    openGraph: {
      title: `${ad.title} في ${ad.city} | ZafayLink`,
      description: ad.description.substring(0, 160),
      images: ['/og-image.png', ...previousImages],
    },
  };
}


async function getWorkerAd(slug: string): Promise<Ad | null> {
    try {
        const q = query(collection(db, 'ads'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return null;
        }
        const adDoc = snapshot.docs[0];
        const data = adDoc.data();
        
        let adData = { id: adDoc.id, ...data } as Ad;
        
        if (!adData.userName || !adData.userAvatar) {
            const userRef = doc(db, 'users', data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                adData = {
                    ...adData,
                    userName: adData.userName || userData.name,
                    userAvatar: adData.userAvatar || `https://api.dicebear.com/8.x/adventurer/svg?seed=${userData.email}`,
                };
            }
        }
        return adData;

    } catch (error) {
        console.error(`Error fetching worker ad with slug ${slug}:`, error);
        return null;
    }
}


export default async function WorkerSlugPage({ params }: Props) {
  const slugOrId = params.slug;

  // Handle legacy ID-based URLs
  if (isFirestoreId(slugOrId)) {
    try {
      const docRef = doc(db, 'ads', slugOrId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const slug = docSnap.data().slug;
        if (slug) {
          redirect(`/workers/${slug}`);
        }
      }
    } catch (e) {
      console.error("Redirect failed for ID:", slugOrId, e);
    }
    // If lookup fails or slug doesn't exist, it will be handled as not found.
    notFound();
  }

  const ad = await getWorkerAd(slugOrId);

  if (!ad || ad.type !== 'worker') {
    notFound();
  }

  return <WorkerDetailsClient ad={ad} />;
}
