import SpeakUpView from '@/components/speak-up/speak-up-view';

// Client-only feature (Web Speech API + Dexie/IndexedDB per device) — the view handles all state.
export default function SpeakUpPage() {
  return <SpeakUpView />;
}
