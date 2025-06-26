
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Ad } from '@/lib/data';
import WorkerDetailsClient from './worker-details-client';

type Props = {
  params: { slug: string }
}

// Helper to check if a string could be a Firestore ID
function isFirestoreId(id: string): boolean {
  return /^[a-zA-Z0-9]{20}$/.test(id);
}

// Fetches a worker ad by its slug
async function getWorkerAdBySlug(slug: string): Promise<Ad | null> {
    try {
        const q = query(collection(db, 'ads'), where('slug', '==', slug), where('type', '==', 'worker'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return null;
        }
        const adDoc = snapshot.docs[0];
        const data = adDoc.data();
        
        let adData = { id: adDoc.id, ...data } as Ad;
        
        // Ensure user details are populated
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

// Fetches a worker ad by its ID
async function getWorkerAdById(id: string): Promise<Ad | null> {
    try {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().type === 'worker') {
            return { id: docSnap.id, ...docSnap.data() } as Ad;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching worker ad with id ${id}:`, error);
        return null;
    }
}

export async function generateStaticParams() {
  try {
    const adsCollection = collection(db, 'ads');
    const q = query(adsCollection, where('type', '==', 'worker'));
    const adsSnapshot = await getDocs(q);
    return adsSnapshot.docs
        .map(doc => ({ slug: doc.data().slug }))
        .filter(item => !!item.slug); // Filter out ads without slugs
  } catch (error) {
    console.error("Error generating static params for workers:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const ad = await getWorkerAdBySlug(params.slug);
  
  if (!ad) {
    return {
      title: 'Worker Not Found',
      description: 'This worker profile may have been moved or deleted.',
    };
  }

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

export default async function WorkerSlugPage({ params }: Props) {
  const slugOrId = params.slug;

  // 1. Try to fetch the worker ad by slug.
  let ad = await getWorkerAdBySlug(slugOrId);

  if (ad) {
    // If found, render the page.
    return <WorkerDetailsClient ad={ad} />;
  }

  // 2. If not found by slug, it might be a legacy ID.
  if (isFirestoreId(slugOrId)) {
    const adById = await getWorkerAdById(slugOrId);
    // If found by ID and it has a slug, redirect to the correct URL.
    if (adById && adById.slug) {
      return redirect(`/workers/${adById.slug}`);
    }
  }

  // 3. If not a valid slug or a redirectable ID, show 404.
  notFound();
}
