import InterviewSession from '@/components/mock-interview/interview-session';

// Client-only feature (Dexie/IndexedDB per device) — the session component handles all state.
export default async function MockInterviewSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InterviewSession interviewId={id} />;
}
