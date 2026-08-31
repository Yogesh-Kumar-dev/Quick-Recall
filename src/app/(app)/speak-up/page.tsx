import SpeakUpView from '@/components/speak-up/speak-up-view';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

// Client-only feature (Web Speech API + Dexie/IndexedDB per device) — the view handles all state.
export default function SpeakUpPage() {
  return <SpeakUpView />;
}
