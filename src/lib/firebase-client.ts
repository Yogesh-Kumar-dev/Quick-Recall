import { getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

// ==============================|| FIREBASE - CLIENT SDK ||============================== //

// Public-by-design config (NEXT_PUBLIC_*) — the same values are hardcoded as literals in
// public/firebase-messaging-sw.js since a static file can't read env vars at runtime.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function firebaseApp() {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function registerAndGetFcmToken(): Promise<string> {
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/firebase-cloud-messaging-push-scope'
  });
  const messagingInstance = getMessaging(firebaseApp());
  const token = await getToken(messagingInstance, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration
  });
  if (!token) throw new Error('Failed to get FCM token');
  return token;
}

// Foreground messages: browsers suppress the SW's background display handler while the tab is
// focused, so this listener is what shows the quote in that case.
export function onForegroundMessage(cb: (payload: { title?: string; body?: string }) => void): () => void {
  if (!isPushSupported()) return () => {};
  let messagingInstance: Messaging;
  try {
    messagingInstance = getMessaging(firebaseApp());
  } catch {
    return () => {};
  }
  return onMessage(messagingInstance, (payload) => {
    cb({ title: payload.data?.title, body: payload.data?.body });
  });
}
