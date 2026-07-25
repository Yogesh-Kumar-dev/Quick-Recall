import type { ZodType } from 'zod';
import { ApiError } from './api-error';

// Parses and validates a JSON request body against a zod schema, throwing ApiError(400, ...)
// on either a malformed body or a failed validation — callers just get back typed, valid data.
export async function parseJsonBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ApiError(400, 'Invalid JSON body');
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? 'Invalid request body');
  }
  return result.data;
}
