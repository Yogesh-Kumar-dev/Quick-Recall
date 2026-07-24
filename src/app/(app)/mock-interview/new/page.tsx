import MockInterviewChat from '@/components/mock-interview/mock-interview-chat';

// Client-only feature (Dexie/IndexedDB per device) — the chat component handles all state.
export default function MockInterviewSetupPage() {
  return <MockInterviewChat />;
}
