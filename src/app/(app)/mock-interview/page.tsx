import MockInterviewView from '@/components/mock-interview/mock-interview-view';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

// Client-only feature (Dexie/IndexedDB per device) — the view handles all state.
export default function MockInterviewPage() {
  return <MockInterviewView />;
}
