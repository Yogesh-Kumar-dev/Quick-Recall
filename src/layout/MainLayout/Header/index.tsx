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
// import ThemeModeSection from './ThemeModeSection'; // temporarily hidden — app defaults to dark mode
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

      {/* right: timer + PWA controls + full screen + nav toggle.
          Spacing is owned by each item's own `ml: 2` wrapper (the established convention for
          TimerSection / FullScreenSection), so no `gap` here — adding one would double the
          spacing and make these icons sit unevenly vs. the bare nav-toggle. */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
        {!isHorizontal && (
          <Box sx={{ ml: 2 }}>
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
          </Box>
        )}

        {/* universal timer: keep visible across breakpoints so a running countdown is always shown */}
        <TimerSection />

        {/* PWA: persistent "Offline" chip — visible only while the device is offline */}
        <OfflineStatusChip />

        {/* PWA: install prompt shown at all breakpoints (primary action); self-hides when
            already installed or no prompt is available */}
        <InstallButton />

        {/* PWA: offline download shown at all breakpoints — it's most useful on mobile */}
        <OfflineDownloadButton />

        {/* light / dark mode toggle — temporarily hidden while app defaults to dark mode */}
        {/* <ThemeModeSection /> */}

        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <FullScreenSection />
        </Box>
      </Box>
    </Box>
  );
}
