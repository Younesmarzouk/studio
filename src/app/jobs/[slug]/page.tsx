
import { redirect } from 'next/navigation';

// This page is a fallback to redirect any lingering slug-based URLs to the main jobs page.
// The primary route for job details is now /jobs/[id].
export default function JobSlugRedirectPage() {
  redirect('/jobs');
}
