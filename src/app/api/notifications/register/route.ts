import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiError } from '@/lib/api-error';
import { parseJsonBody } from '@/lib/api-handler';
import { connectMongo } from '@/lib/mongoose';
import Device from '@/models/Device';

const registerSchema = z.object({
  deviceId: z.string().min(1),
  fcmToken: z.string().min(1),
  userAgent: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional()
});

// Idempotent upsert-by-deviceId — safe to call repeatedly (toggle spam, token-refresh re-registration).
export async function POST(req: Request) {
  try {
    const { deviceId, fcmToken, userAgent, timezone, language } = await parseJsonBody(req, registerSchema);

    await connectMongo();
    await Device.findOneAndUpdate({ deviceId }, { deviceId, fcmToken, userAgent, timezone, language, enabled: true }, { upsert: true });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
