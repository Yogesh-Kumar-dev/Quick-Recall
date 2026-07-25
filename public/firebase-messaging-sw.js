// Firebase Cloud Messaging service worker — deliberately separate from the Serwist-compiled
// worker (src/app/serwist/[path]/route.ts), registered at its own scope. A static file can't
// read NEXT_PUBLIC_* env vars at runtime, so this config is hardcoded — safe, it's public by
// design (see docs/superpowers/specs/2026-07-25-push-notifications-design.md).
importScripts('https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBXvhAOHmRjWpVQ3klHNRCFvy18lfxPxCw',
  authDomain: 'quickrecall-a2baf.firebaseapp.com',
  projectId: 'quickrecall-a2baf',
  storageBucket: 'quickrecall-a2baf.firebasestorage.app',
  messagingSenderId: '14073447841',
  appId: '1:14073447841:web:acfc410cc7701888ad37e0'
});

const messaging = firebase.messaging();

// Background handler — fires only while the tab is not focused (foreground case is handled by
// onMessage in src/lib/firebase-client.ts).
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.data || {};
  self.registration.showNotification(title || 'QuickRecall', { body });
});
