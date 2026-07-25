'use client';

import { IconBellRinging } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import usePushSettings from './use-push-settings';

// ==============================|| SETTINGS - VIEW ||============================== //

export default function SettingsView() {
  const { settings, loading, busy, enable, disable, isPushSupported, permissionDenied } = usePushSettings();
  const enabled = settings?.enabled ?? false;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage device-level preferences for QuickRecall.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconBellRinging className="size-5 text-primary" />
            <CardTitle>Push notifications</CardTitle>
          </div>
          <CardDescription>
            Get a daily motivational/study quote sent to this device, even when the app isn&apos;t open. One per day, no personalization yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isPushSupported && !loading && (
            <p className="text-sm text-muted-foreground">Push notifications aren&apos;t supported in this browser.</p>
          )}
          {isPushSupported && (
            <div className="flex items-center justify-between">
              <span className="text-sm">{enabled ? 'Enabled on this device' : 'Disabled on this device'}</span>
              <Button
                variant={enabled ? 'outline' : 'default'}
                disabled={loading || busy}
                onClick={() => (enabled ? disable() : enable())}
              >
                {enabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          )}
          {permissionDenied && (
            <p className="text-xs text-muted-foreground">
              Notifications are blocked for this site in your browser settings — re-enable them there to turn this on.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
