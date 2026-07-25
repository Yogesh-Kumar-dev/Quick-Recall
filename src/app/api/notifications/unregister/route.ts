import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiError } from '@/lib/api-error';
import { parseJsonBody } from '@/lib/api-handler';
import { connectMongo } from '@/lib/mongoose';
import Device from '@/models/Device';

const unregisterSchema = z.object({ deviceId: z.string().min(1) });

// Soft — flips enabled: false but keeps the row (and its audit history) intact.
export async function POST(req: Request) {
  try {
    const { deviceId } = await parseJsonBody(req, unregisterSchema);

    await connectMongo();
    await Device.updateOne({ deviceId }, { enabled: false });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
