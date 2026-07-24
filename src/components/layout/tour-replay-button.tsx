'use client';

import { IconRoute } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function TourReplayButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => router.push('/dashboard?tour=1')}
      aria-label="Replay product tour"
      title="Replay product tour"
    >
      <IconRoute size={20} />
    </Button>
  );
}
