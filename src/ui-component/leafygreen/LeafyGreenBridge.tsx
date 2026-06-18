'use client';

import type { ReactNode } from 'react';

// leafygreen
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// ==============================|| LEAFYGREEN PROVIDER BRIDGE ||============================== //

// Bridges the app's ConfigContext theme mode to LeafyGreen's own dark-mode context, so real
// @leafygreen-ui components (Button, Card, Badge, …) follow the same light/dark toggle as MUI.
// Must render inside ConfigProvider (it reads useConfig). LeafyGreen ships its own Emotion
// instance, so this provider is independent of MUI's ThemeProvider.
export default function LeafyGreenBridge({ children }: { children: ReactNode }) {
  const { mode } = useConfig();
  return <LeafyGreenProvider darkMode={mode === ThemeMode.DARK}>{children}</LeafyGreenProvider>;
}
