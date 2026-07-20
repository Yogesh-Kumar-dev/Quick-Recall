import SessionChat from '@/components/mock-interview/session-chat';

// Client-only feature (Dexie/IndexedDB per device) — the chat component handles all state.
export default async function MockInterviewSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SessionChat interviewId={id} />;
}
