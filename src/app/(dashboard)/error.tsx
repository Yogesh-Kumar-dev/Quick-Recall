'use client';

// react
import { useEffect } from 'react';

// next
import Link from 'next/link';

// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// icons
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';

// project imports
import { DASHBOARD_PATH } from 'config';
import { CONTACT_URL } from 'ui-component/SuggestProblemBanner';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD ERROR BOUNDARY ||============================== //

// Segment-level error boundary for the dashboard route group. Next.js wires this up
// automatically as a React Error Boundary around the (dashboard) segment, so the
// surrounding MainLayout (sidebar + header) stays mounted while a friendly fallback
// renders in the content area. `reset` re-renders the segment to retry.

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack sx={{ gap: gridSpacing, alignItems: 'center', justifyContent: 'center', minHeight: '70vh', p: 3 }}>
      <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h2">Something went wrong</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
          An unexpected error occurred while loading this page. You can try again, head back to the dashboard, or reach out if it keeps
          happening.
        </Typography>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <AnimateButton>
          <Button variant="contained" size="large" onClick={reset}>
            <RefreshTwoToneIcon sx={{ fontSize: '1.3rem', mr: 0.75 }} /> Try again
          </Button>
        </AnimateButton>
        <AnimateButton>
          <Button variant="outlined" size="large" component={Link} href={DASHBOARD_PATH}>
            <HomeTwoToneIcon sx={{ fontSize: '1.3rem', mr: 0.75 }} /> Dashboard
          </Button>
        </AnimateButton>
        <AnimateButton>
          <Button variant="outlined" size="large" color="secondary" href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
            <MailTwoToneIcon sx={{ fontSize: '1.3rem', mr: 0.75 }} /> Contact
          </Button>
        </AnimateButton>
      </Stack>
    </Stack>
  );
}
