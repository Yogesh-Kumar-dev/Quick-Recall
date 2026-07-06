import JobTrackerView from '@/components/job-tracker/job-tracker-view';

// Client-only feature (Dexie/IndexedDB per device) — the view handles all state.
export default function JobTrackerPage() {
  return <JobTrackerView />;
}
