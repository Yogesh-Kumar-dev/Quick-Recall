import MockInterviewView from '@/components/mock-interview/mock-interview-view';

// Client-only feature (Dexie/IndexedDB per device) — the view handles all state.
export default function MockInterviewPage() {
  return <MockInterviewView />;
}
