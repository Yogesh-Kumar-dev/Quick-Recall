'use client';

import { IconHome, IconMail, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const CONTACT_URL = 'https://yogesh-kumar-portfolio-v2.vercel.app/#contact';

// Segment-level error boundary for the app route group. Next.js wires this up automatically as a
// React Error Boundary around the (app) segment, so the surrounding layout (sidebar + header) stays
// mounted while this fallback renders in the content area. `reset` re-renders the segment to retry.
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">Something went wrong</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          An unexpected error occurred while loading this page. You can try again, head back to the dashboard, or reach out if it keeps
          happening.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          <IconRefresh /> Try again
        </Button>
        <Button variant="outline" size="lg" render={<Link href="/" />}>
          <IconHome /> Dashboard
        </Button>
        <Button variant="outline" size="lg" render={<a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" />}>
          <IconMail /> Contact
        </Button>
      </div>
    </div>
  );
}
