import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-bold">404 — Page not found</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          The page you are looking for was moved, removed, renamed, or might never have existed.
        </p>
      </div>
      <Button size="lg" render={<Link href="/" />}>
        <IconHome /> Home
      </Button>
    </div>
  );
}
