'use client';

import { useCallback, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// project imports
import { ThemeMode } from 'config';

// assets
import { IconDeviceMobileDown } from '@tabler/icons-react';

// ==============================|| HEADER CONTENT - PWA INSTALL ||============================== //
//
// Captures the browser's `beforeinstallprompt` event and exposes a custom "Install app" button
// that triggers the native install dialog. Hides itself when there's no prompt available (e.g.
// already installed, unsupported browser, or the app is already running standalone).

// Minimal typing for the non-standard beforeinstallprompt event.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const theme = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // already-installed check (standalone display mode / iOS)
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;
    setIsStandalone(!!standalone);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault(); // stop Chrome's mini-infobar so we control the prompt
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  }, [deferredPrompt]);

  // Nothing to install (already installed, or no prompt yet) → render nothing.
  if (isStandalone || !deferredPrompt) return null;

  return (
    <Box sx={{ ml: 2 }}>
      <Tooltip title="Install app">
        <Avatar
          variant="rounded"
          role="button"
          aria-label="Install app"
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
          onClick={handleInstall}
          color="inherit"
        >
          <IconDeviceMobileDown />
        </Avatar>
      </Tooltip>
    </Box>
  );
}
