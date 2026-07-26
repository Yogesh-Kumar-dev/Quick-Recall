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

// Full error detail (name, code, message, response body) crammed into the toast itself — this
// flow fails almost exclusively on mobile PWAs where there's no console to check, so the toast
// IS the debug tool.
function describeError(err: unknown): string {
  const parts: string[] = [];
  if (axios.isAxiosError(err)) {
    parts.push(`axios ${err.code ?? ''} status=${err.response?.status ?? 'none'}`.trim());
    if (err.response?.data) parts.push(`response=${JSON.stringify(err.response.data)}`);
    parts.push(err.message);
  } else if (err instanceof Error) {
    const code = (err as { code?: string }).code;
    if (code) parts.push(`code=${code}`);
    parts.push(`${err.name}: ${err.message}`);
  } else {
    parts.push(String(err));
  }
  return parts.join('\n');
}

// Sticks around (no auto-dismiss) so the full detail can be read/screenshotted on a phone.
function reportError(action: string, err: unknown): void {
  console.error(`[push] ${action} failed:`, err);
  toast.error(`Could not ${action} push notifications`, { description: describeError(err), duration: Number.POSITIVE_INFINITY });
}

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
    } catch (err) {
      reportError('enable', err);
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
    } catch (err) {
      reportError('disable', err);
    } finally {
      setBusy(false);
    }
  }, [settings]);

  return { settings, loading, busy, enable, disable, isPushSupported: supported, permissionDenied };
}
