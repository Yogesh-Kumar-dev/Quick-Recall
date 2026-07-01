'use client';

// material-ui
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

// assets
import { IconWifiOff } from '@tabler/icons-react';

// project imports
import useOnlineStatus from 'hooks/useOnlineStatus';

// ==============================|| HEADER CONTENT - OFFLINE STATUS CHIP ||============================== //
//
// Persistent "Offline" chip shown in the header only while the device is offline (reuses the
// shared useOnlineStatus hook). Gives an always-glanceable signal that saved sections still work
// but live content won't load. Renders nothing when online.

export default function OfflineStatusChip() {
  const online = useOnlineStatus();

  return (
    <Fade in={!online} unmountOnExit>
      <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
        <Chip
          size="small"
          color="warning"
          variant="outlined"
          icon={<IconWifiOff size={16} />}
          label="Offline"
          aria-live="polite"
          sx={{ fontWeight: 600 }}
        />
      </Box>
    </Fade>
  );
}
