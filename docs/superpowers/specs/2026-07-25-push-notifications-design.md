# Push Notifications (v1 — Motivational Quote Pushes) — Design

## Context

QuickRecall already has an in-app notification system (`src/notifications/`) — but it's purely local: the Web Notification API or a `sonner` toast, fired only while a tab is open, driven by app code (timer, distraction nudges, review due). There's no way to reach a user when the app isn't open.

The goal isn't "increase app opens" — it's a personal interview-prep coach that nudges at the right time. The full brainstorm covered five use cases (daily reminder, streak motivation, interview countdown, day-of reminder, post-interview capture), but the two richest ones (interview countdown, streak-aware reminders) both require data that today lives **only** in client-side IndexedDB (Job Tracker `rounds[].at`, the `attempts`-derived streak in `practice-stats.tsx`) — syncing either to a server is real scope. **v1 is deliberately narrower**: device registration + a daily rotating motivational/study quote pushed via Firebase Cloud Messaging. No Job Tracker or streak personalization yet — that's future work once this pipeline exists and proves out.

This is the first backend QuickRecall has ever had: first API routes, first external service dependency (Firebase Admin, MongoDB), first thing writing to a server-side database. Everything else in the app is unaffected — this is purely additive.

## Scope decisions (confirmed)

- **v1 use case**: daily rotating quote/motivational push only. Interview countdown, streak-aware copy, day-of and post-interview nudges are explicitly deferred (they need Job Tracker / attempts data synced server-side, which is out of scope here).
- **Quote source**: MongoDB `notificationTemplates` collection (not a static file) — editable without a redeploy.
- **Send cadence**: once daily, fixed UTC hour (09:00 UTC), same for every device. No per-device timezone-aware send time in v1.
- **Audit log**: yes — every send attempt (success or failure) is logged to a `notifications` collection, since there's no in-app notification center to otherwise see what fired.
- **Opt-in UX**: a new standalone `/settings` route (new sidebar entry), not folded into the existing `src/notifications/` category-prefs system — push is architecturally different (needs an FCM token + a backend call, not just a local boolean).
- **Device identity**: `crypto.randomUUID()`, generated once and persisted client-side, not a native-style hardware ID. This mirrors what native platforms actually do internally — iOS's `identifierForVendor` and Android/Firebase's Installation ID are themselves just app-generated UUIDs stored in platform storage, not real hardware identifiers (both platforms removed access to those years ago for privacy reasons). The one real asymmetry: iOS stores its UUID in the Keychain, which survives an app uninstall/reinstall; the web has no storage equivalent that survives an uninstall, so a PWA reinstall will generate a new `deviceId`. This is an inherent web-platform limitation, not a gap in this design — see Edge Cases.
- **Device metadata**: registration also captures `userAgent`, `timezone` (`Intl.DateTimeFormat().resolvedOptions().timeZone`), and `language` (`navigator.language`) for visibility in the `devices` collection. Descriptive only, not used for identity or send-time logic in v1.
- **Service worker strategy**: a **separate** service worker (`public/firebase-messaging-sw.js`) registered at a custom scope (`/firebase-cloud-messaging-push-scope`), not merged into the existing Serwist-compiled worker. Serwist's worker (`src/app/serwist/[path]/route.ts`) is already documented in `CLAUDE.md` as a fiddly Turbopack workaround; keeping Firebase messaging fully separate means zero changes to that infra and no shared blast radius if either one misbehaves. Trade-off: the static SW file needs Firebase's public web config hardcoded as literals (can't read `NEXT_PUBLIC_*` env vars at runtime from a static file) — acceptable since that config is public-safe by design.
- **MongoDB access**: Mongoose (not the raw `mongodb` driver) — schemas/models with `{ timestamps: true }`, connection cached on `global` per the standard Next.js serverless pattern.

## Architecture

```
Settings page (new /settings route)
   │ user toggles "Enable push notifications"
   ▼
Notification.requestPermission()
   │ granted
   ▼
Read/create deviceId in Dexie `pushSettings` table (crypto.randomUUID() if absent)
   │
   ▼
navigator.serviceWorker.register('/firebase-messaging-sw.js',
   { scope: '/firebase-cloud-messaging-push-scope' })
   │
   ▼
getToken(messaging, { vapidKey, serviceWorkerRegistration }) → FCM token
   │
   ▼
POST /api/notifications/register { deviceId, fcmToken, userAgent, timezone, language }
   │
   ▼
MongoDB (Mongoose): upsert Device by deviceId

─────────────────────────────────────────────

Vercel Cron (daily, 09:00 UTC)
   │
   ▼
GET /api/cron/send-quote  (rejects unless Authorization: Bearer $CRON_SECRET matches)
   │
   ▼
NotificationTemplate.aggregate([{ $match: { active: true } }, { $sample: { size: 1 } }])
   │
   ▼
Device.find({ enabled: true })
   │
   ▼
Firebase Admin SDK: admin.messaging().sendEachForMulticast(...)
   │
   ├─ success → Notification.create({ ..., status: 'sent' })
   └─ failure (invalid/unregistered token)
        → Notification.create({ ..., status: 'failed', error })
        → Device.updateOne({ deviceId }, { enabled: false })
```

## Data models (Mongoose)

```ts
// src/models/Device.ts
const deviceSchema = new Schema(
  {
    deviceId: { type: String, required: true, unique: true },
    fcmToken: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    userAgent: String,
    timezone: String,
    language: String
  },
  { timestamps: true }
);

// src/models/NotificationTemplate.ts
const notificationTemplateSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// src/models/Notification.ts  (audit log)
const notificationSchema = new Schema(
  {
    deviceId: { type: String, required: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'NotificationTemplate', required: true },
    title: String,
    body: String,
    status: { type: String, enum: ['sent', 'failed'], required: true },
    error: String,
    sentAt: { type: Date, default: Date.now }
  }
);
```

Indexes: `Device.deviceId` (unique, from `unique: true`), `Device.enabled`, `Notification.deviceId`, `Notification.sentAt`.

Connection (`src/lib/mongoose.ts`): cache the connection promise on `global` so warm serverless invocations reuse it instead of reconnecting per request.

## Client-side persistence (Dexie)

New table on the existing `quickrecall` database (bumps `version(3)`, purely additive — no `.upgrade()` needed):

```ts
// src/types/push-settings.ts
interface PushSettings {
  id: 'push'; // fixed key, always exactly one row
  deviceId: string;
  enabled: boolean;
  fcmToken?: string;
  updatedAt: number;
}
```

Repository (`src/db/push-settings.ts`) + `usePushSettings()` hook on `useLiveQuery`, matching the existing pattern (`src/db/jobs.ts` / `use-jobs.ts`). This — not `localStorage` — is the right fit: unlike `src/notifications/prefs.ts` (which needs synchronous reads from a framework-agnostic manager outside React), push registration state is only ever read/written from the Settings page and API calls, both already async.

## API routes

- **`POST /api/notifications/register`** — body `{ deviceId, fcmToken, userAgent?, timezone?, language? }`. `Device.findOneAndUpdate({ deviceId }, { ...body, enabled: true }, { upsert: true })` — idempotent, safe to call repeatedly (toggle spam, token-refresh re-registration).
- **`POST /api/notifications/unregister`** — body `{ deviceId }`. Sets `enabled: false`. Soft — keeps audit history intact, doesn't delete the row.
- **`GET /api/cron/send-quote`** — guarded by `CRON_SECRET`; 401s immediately (no DB/FCM calls) if the header doesn't match. Runs the send flow described in Architecture above.

## Cron config

New `vercel.json`:
```json
{
  "crons": [{ "path": "/api/cron/send-quote", "schedule": "0 9 * * *" }]
}
```

## Client registration flow

New `/settings` route (new sidebar entry in `src/config/nav.ts`, under `primaryNav`):
1. Toggle "Enable push notifications" → `Notification.requestPermission()`.
2. On grant: read/create `deviceId` in `pushSettings`.
3. Register `firebase-messaging-sw.js` at the custom scope.
4. `getToken()` → FCM token.
5. `POST /api/notifications/register` with device metadata.
6. Write the result back to the local `pushSettings` row so the Settings page reflects state live.

Toggling off: `POST /api/notifications/unregister`, then set local `enabled: false`.

**Foreground messages**: while the tab is open and focused, the SW's background handler won't fire (browsers suppress SW-driven display when the origin is foregrounded). A small `onMessage` listener in a client component shows the quote via the existing `sonner` toast — reuses the pattern in `src/notifications/manager.ts`'s `fireSnackbar`, not a new notification system.

## Environment variables

- `MONGODB_URI`
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (Admin SDK service account, server-only)
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID` (client SDK config, public by design)
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- `CRON_SECRET`

`public/firebase-messaging-sw.js` hardcodes the same public Firebase config as literals (static file, can't read env vars at request time).

## New dependencies

`firebase` (client SDK), `firebase-admin` (server SDK), `mongoose`.

## Edge cases

- **Permission denied/blocked**: toggle reverts to off; inline text explains it must be re-enabled in browser settings (browsers won't re-show the native prompt once denied).
- **Push unsupported** (e.g. iOS Safari outside a PWA context, or old versions): feature-detect `'serviceWorker' in navigator && 'PushManager' in window` before showing the toggle; if unsupported, show it disabled with a short explanation.
- **`getToken()` fails**: caught, toasted as an error, toggle reverts to off. No retry loop.
- **Stale/invalid FCM token at send time**: cron catches `messaging/registration-token-not-registered` / `messaging/invalid-registration-token` per device, flips `enabled: false`, logs the failure. Self-heals — no manual cleanup needed.
- **Other FCM failures** (rate limit, transient network): logged with `status: 'failed'`, device stays enabled — gets another shot on the next run.
- **No active templates / no enabled devices**: cron no-ops cleanly with a 200, no FCM calls.
- **Duplicate register calls**: idempotent via upsert-by-`deviceId`.
- **PWA uninstall/reinstall generates a new `deviceId`**: IndexedDB doesn't survive an uninstall (no web equivalent of iOS Keychain's uninstall-survival). The old device's token eventually fails on the next cron send and gets auto-disabled — no manual cleanup needed. Not worth solving for a single-user personal project; would require login/accounts to fix properly.

## Out of scope (this pass)

- Interview countdown, day-of, and post-interview nudges (need Job Tracker data synced server-side).
- Streak-aware daily reminder copy (needs attempts/streak data synced server-side — currently computed client-side only, per `practice-stats.tsx`).
- Per-device timezone-aware send time (would need an hourly cron tick + a stored offset).
- `notifications` in-app center / UI to browse the audit log (it exists purely for backend visibility in v1).
- Merging Firebase messaging into the Serwist-compiled worker.

## Verification

No existing test suite covers this kind of flow (per `CLAUDE.md`, `pnpm test` is a no-op placeholder; the repo's Vitest coverage is pure logic in `src/lib/*.test.ts`). Verification is manual:
1. `pnpm typecheck`, `pnpm lint`, `pnpm build` all pass.
2. Toggle on in `/settings` → confirm a `Device` row appears in MongoDB.
3. Manually trigger `/api/cron/send-quote` locally (`curl` with the correct `CRON_SECRET` header) → confirm a real push arrives (tab closed, background) and a toast appears (tab open, foreground) → confirm a `Notification` audit row was written.
4. Toggle off → confirm the device flips to `enabled: false`, and a subsequent manual cron trigger skips it.
