'use client';

import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

// project imports
import { ThemeMode } from 'config';
import useOfflineDownload from 'hooks/useOfflineDownload';
import OfflineDownloadPanel from './OfflineDownloadPanel';

// assets
import { IconCloudDownload } from '@tabler/icons-react';

// ==============================|| HEADER CONTENT - OFFLINE DOWNLOAD ||============================== //
//
// Header icon button that opens the offline-download dialog. Owns the download state (via the
// hook) so progress keeps advancing even while the dialog is closed; a badge dot indicates an
// active download.

export default function OfflineDownloadButton() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const download = useOfflineDownload();

  // Hidden entirely where service workers aren't available — offline download is meaningless.
  if (!download.isSupported) return null;

  return (
    <Box sx={{ ml: 2 }}>
      <Tooltip title="Download for offline">
        <Badge color="primary" variant="dot" invisible={!download.isRunning} overlap="circular">
          <Avatar
            variant="rounded"
            role="button"
            aria-label="Download for offline"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              border: '1px solid',
              borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
              color: 'primary.dark',
              transition: 'all .2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.main',
                color: 'primary.light'
              }
            }}
            onClick={() => setOpen(true)}
            color="inherit"
          >
            <IconCloudDownload />
          </Avatar>
        </Badge>
      </Tooltip>

      <OfflineDownloadPanel open={open} onClose={() => setOpen(false)} download={download} />
    </Box>
  );
}
