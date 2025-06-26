
import { redirect } from 'next/navigation';

// This page is a fallback to redirect any lingering slug-based URLs to the main workers page.
// The primary route for worker details is now /workers/[id].
export default function WorkerSlugRedirectPage() {
  redirect('/workers');
}
