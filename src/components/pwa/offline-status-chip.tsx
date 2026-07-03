'use client';

import { IconWifiOff } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import useOnlineStatus from '@/hooks/useOnlineStatus';

// Persistent "Offline" chip shown in the header only while the device is offline (reuses the
// shared useOnlineStatus hook). Gives an always-glanceable signal that saved sections still work
// but live content won't load. Renders nothing when online.
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
