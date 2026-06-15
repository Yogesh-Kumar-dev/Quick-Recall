'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import TimerSection from './TimerSection';
import FullScreenSection from './FullScreenSection';
import { InstallButton, OfflineDownloadButton, OfflineStatusChip } from 'ui-component/pwa';

import { MenuOrientation, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { mode, menuOrientation } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* left: logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' } }}>
          <LogoSection />
        </Box>
      </Box>

      {/* center: search */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <SearchSection />
      </Box>

      {/* right: full screen + nav toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, flex: 1 }}>
        {!isHorizontal && (
          <Tooltip title={drawerOpen ? 'Close navigation' : 'Open navigation'} placement="bottom">
            <Avatar
              variant="rounded"
              role="button"
              aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                overflow: 'hidden',
                transition: 'all .2s ease-in-out',
                cursor: 'pointer',
                bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
                color: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
                '&:hover': {
                  bgcolor: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
                  color: mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
                }
              }}
              onClick={() => handlerDrawerOpen(!drawerOpen)}
              color="inherit"
            >
              <IconMenu2 stroke={1.5} size="20px" />
            </Avatar>
          </Tooltip>
        )}

        {/* universal timer: keep visible across breakpoints so a running countdown is always shown */}
        <TimerSection />

        {/* PWA: persistent "Offline" chip — visible only while the device is offline */}
        <OfflineStatusChip />

        {/* PWA: install prompt shown at all breakpoints (primary action); self-hides when
            already installed or no prompt is available */}
        <InstallButton />

        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <OfflineDownloadButton />
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <FullScreenSection />
        </Box>
      </Box>
    </Box>
  );
}
