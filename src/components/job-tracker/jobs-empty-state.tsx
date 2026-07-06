import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ==============================|| JOB TRACKER - EMPTY STATE ||============================== //

export default function JobsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Briefcase className="mb-3 size-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">No job applications yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Track every role you apply to — company, recruiter contacts, and where you found it — all in one place.
      </p>
      <Button className="mt-4 gap-1.5" onClick={onAdd}>
        <Plus className="size-4" />
        Add your first job
      </Button>
    </div>
  );
}
