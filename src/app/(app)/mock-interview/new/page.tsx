import MockInterviewChat from '@/components/mock-interview/mock-interview-chat';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

// Client-only feature (Dexie/IndexedDB per device) — the chat component handles all state.
export default function MockInterviewSetupPage() {
  return <MockInterviewChat />;
}
