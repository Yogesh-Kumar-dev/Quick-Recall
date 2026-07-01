import { IconPlus } from '@tabler/icons-react';

// Real MongoDB LeafyGreen EmptyState (inherits dark mode via LeafyGreenBridge).
import { LGEmptyState, LGButton, LGButtonVariant } from 'ui-component/leafygreen';

// ==============================|| JOB TRACKER - EMPTY STATE ||============================== //

interface JobsEmptyStateProps {
  onAdd: () => void;
}

export default function JobsEmptyState({ onAdd }: JobsEmptyStateProps) {
  return (
    <LGEmptyState
      title="No job applications yet"
      description="Track every role you apply to — company, recruiter contacts, and where you found it — all in one place."
      primaryButton={
        <LGButton variant={LGButtonVariant.Primary} leftGlyph={<IconPlus size={16} />} onClick={onAdd}>
          Add your first job
        </LGButton>
      }
    />
  );
}
