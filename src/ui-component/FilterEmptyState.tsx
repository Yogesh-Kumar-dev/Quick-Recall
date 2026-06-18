'use client';

import Box from '@mui/material/Box';

// Real MongoDB LeafyGreen EmptyState (inherits dark mode via LeafyGreenBridge).
import { LGEmptyState } from 'ui-component/leafygreen';

interface FilterEmptyStateProps {
  /** What kind of thing was filtered, e.g. "notes", "problems", "hooks". Default: "results". */
  noun?: string;
  /** Override the full title if the default doesn't fit. */
  title?: string;
  /** Override the description. */
  description?: string;
}

// Shared empty state for "your current filters matched nothing" across the notes / list pages.
// Distinct from the per-feature "no data at all" empty states (job-tracker, bookmarks, review):
// this one tells the user to loosen their filters, not to create their first item.
export default function FilterEmptyState({ noun = 'results', title, description }: FilterEmptyStateProps) {
  return (
    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <LGEmptyState
        title={title ?? `No ${noun} match your filters`}
        description={description ?? 'Try clearing or loosening the filters above to see more.'}
      />
    </Box>
  );
}
