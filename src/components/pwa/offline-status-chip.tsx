'use client';

import { IconWifiOff } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import useOnlineStatus from '@/hooks/useOnlineStatus';

export default function OfflineStatusChip() {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <Badge variant="outline" aria-live="polite" className="gap-1 border-[color:var(--chart-4)] font-semibold text-[color:var(--chart-4)]">
      <IconWifiOff size={14} />
      Offline
    </Badge>
  );
}
