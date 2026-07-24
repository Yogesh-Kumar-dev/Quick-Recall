import MockInterviewChat from '@/components/mock-interview/mock-interview-chat';

// Client-only feature (Dexie/IndexedDB per device) — the chat component handles all state.
export default async function MockInterviewSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MockInterviewChat interviewId={id} />;
}
