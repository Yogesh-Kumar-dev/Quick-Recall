'use client';

import axios from 'axios';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as pushSettingsRepository from '@/db/push-settings';
import { isPushSupported, registerAndGetFcmToken } from '@/lib/firebase-client';
import { makeId } from '@/lib/id';
import { requestPermission } from '@/notifications/manager';

// ==============================|| SETTINGS - usePushSettings HOOK ||============================== //

export default function usePushSettings() {
  const settings = useLiveQuery(() => pushSettingsRepository.get());
  const loading = settings === undefined;
  const [busy, setBusy] = useState(false);
  // Computed post-mount only — `typeof window` differs between SSR and hydration, so an
  // inline check here would trigger a hydration mismatch.
  const [supported, setSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  useEffect(() => {
    setSupported(isPushSupported());
    setPermissionDenied(typeof Notification !== 'undefined' && Notification.permission === 'denied');
  }, []);

  const enable = useCallback(async () => {
    setBusy(true);
    try {
      if (!isPushSupported()) {
        toast.error('Push notifications are not supported in this browser.');
        return;
      }
      const permission = await requestPermission();
      if (permission !== 'granted') {
        toast.error('Notification permission was not granted.');
        return;
      }

      const deviceId = settings?.deviceId || makeId();
      const fcmToken = await registerAndGetFcmToken();

      await axios.post('/api/notifications/register', {
        deviceId,
        fcmToken,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      });

      await pushSettingsRepository.save({ deviceId, fcmToken, enabled: true });
      toast.success('Push notifications enabled.');
    } catch {
      toast.error('Could not enable push notifications.');
    } finally {
      setBusy(false);
    }
  }, [settings]);

  const disable = useCallback(async () => {
    if (!settings?.deviceId) return;
    setBusy(true);
    try {
      await axios.post('/api/notifications/unregister', { deviceId: settings.deviceId });
      await pushSettingsRepository.save({ enabled: false });
      toast.success('Push notifications disabled.');
    } catch {
      toast.error('Could not disable push notifications.');
    } finally {
      setBusy(false);
    }
  }, [settings]);

  return { settings, loading, busy, enable, disable, isPushSupported: supported, permissionDenied };
}
