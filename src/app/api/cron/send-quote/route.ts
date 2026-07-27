import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/api-error';
import { messaging } from '@/lib/firebase-admin';
import { connectMongo } from '@/lib/mongoose';
import Device from '@/models/Device';
import Notification from '@/models/Notification';
import NotificationTemplate from '@/models/NotificationTemplate';

const INVALID_TOKEN_ERRORS = ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'];

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new ApiError(401, 'Unauthorized');
    }

    await connectMongo();

    // Round-robin, not random: always pick the active template that's least recently been sent
    // (unset lastSentAt sorts first), so every template cycles through once before any repeat.
    const [template, devices] = await Promise.all([
      NotificationTemplate.findOneAndUpdate({ active: true }, { lastSentAt: new Date() }, { sort: { lastSentAt: 1 } }),
      Device.find({ enabled: true })
    ]);

    if (!template || devices.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const res = await messaging().sendEach(
      devices.map((d) => ({
        token: d.fcmToken,
        // data-only (not `notification`) — the FCM SW SDK auto-displays any `notification`
        // payload on top of our own showNotification() call in firebase-messaging-sw.js,
        // causing a duplicate. data-only payloads are never auto-displayed.
        data: { title: template.title, body: template.body }
      }))
    );

    const auditRows = res.responses.map((r, i) => ({
      deviceId: devices[i].deviceId,
      templateId: template._id,
      title: template.title,
      body: template.body,
      status: r.success ? ('sent' as const) : ('failed' as const),
      error: r.error?.code
    }));
    const disabledDeviceIds = auditRows.filter((row) => row.error && INVALID_TOKEN_ERRORS.includes(row.error)).map((row) => row.deviceId);

    await Promise.all([
      Notification.insertMany(auditRows),
      disabledDeviceIds.length ? Device.updateMany({ deviceId: { $in: disabledDeviceIds } }, { enabled: false }) : Promise.resolve()
    ]);

    return NextResponse.json({ ok: true, sent: res.successCount, failed: res.failureCount });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
