'use client';

import { IconDeviceMobileDown } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

// non-standard beforeinstallprompt event has no DOM lib typing
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // already-installed check (standalone display mode / iOS)
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
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

  if (isStandalone || !deferredPrompt) return null;

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleInstall} aria-label="Install app" title="Install app">
      <IconDeviceMobileDown size={20} />
    </Button>
  );
}
