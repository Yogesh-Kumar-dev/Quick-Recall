import mongoose from 'mongoose';

// ==============================|| MONGOOSE - CACHED CONNECTION ||============================== //

// Standard Next.js serverless pattern: cache the connection promise on `global` so warm
// invocations reuse it instead of reconnecting per request.

declare global {
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export function connectMongo(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!global._mongooseConn) {
    // Clear the cache on failure — otherwise a transient connect error (cold-start DNS/network
    // blip) permanently wedges every request on this warm instance behind the same stale rejection.
    global._mongooseConn = mongoose.connect(uri).catch((err) => {
      global._mongooseConn = undefined;
      throw err;
    });
  }
  return global._mongooseConn;
}
