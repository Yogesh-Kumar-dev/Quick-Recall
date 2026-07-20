import SetupChat from '@/components/mock-interview/setup-chat';

// Client-only feature (Dexie/IndexedDB per device) — the chat component handles all state.
export default function MockInterviewSetupPage() {
  return <SetupChat />;
}
