import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// ==============================|| FIREBASE ADMIN - SERVER SDK ||============================== //

// Server-only: service account credentials, never exposed to the client bundle.

function adminApp() {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel env vars store literal "\n" — real newlines are required by the SDK.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export function messaging() {
  return getMessaging(adminApp());
}
