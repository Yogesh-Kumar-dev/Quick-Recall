'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import WalkthroughLayout, { type WalkthroughItem } from 'ui-component/deep-dive/WalkthroughLayout';

import DemoProviders from './DemoProviders';
import TanstackQuotesDemo from './tanstack/QuotesDemo';
import RtkQuotesDemo from './rtk/QuotesDemo';
import { tanstackAnnotations, tanstackCode } from './tanstack/impl.source';
import { rtkAnnotations, rtkCode } from './rtk/impl.source';

// Side-by-side comparison rows, rendered once below the per-variant content.
const COMPARISON: { aspect: string; tanstack: string; rtk: string }[] = [
  { aspect: 'Belongs to', tanstack: 'Standalone — any React app', rtk: 'Part of Redux Toolkit' },
  { aspect: 'Cache lives in', tanstack: "Its own QueryClient (outside Redux)", rtk: 'Redux store (state.quotesApi)' },
  { aspect: 'Hooks', tanstack: 'You call useQuery yourself', rtk: 'Auto-generated per endpoint' },
  { aspect: 'Cache key', tanstack: 'queryKey array', rtk: 'The query arg' },
  { aspect: 'Invalidation', tanstack: 'queryKey + invalidateQueries', rtk: 'Cache tags (providesTags/invalidatesTags)' },
  { aspect: 'Setup', tanstack: 'Wrap in QueryClientProvider', rtk: 'Add reducer + middleware to store' }
];

function ComparisonStrip() {
  return (
    <Box>
      <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5} display="block" mb={1.5}>
        At a glance
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& td, & th': { p: 1, textAlign: 'left', borderBottom: 1, borderColor: 'divider', verticalAlign: 'top' } }}>
          <Box component="thead">
            <Box component="tr">
              <Box component="th" sx={{ width: '20%' }} />
              <Box component="th"><Typography variant="subtitle2" fontWeight={700}>TanStack Query</Typography></Box>
              <Box component="th"><Typography variant="subtitle2" fontWeight={700}>RTK Query</Typography></Box>
            </Box>
          </Box>
          <Box component="tbody">
            {COMPARISON.map((row) => (
              <Box component="tr" key={row.aspect}>
                <Box component="td"><Typography variant="body2" fontWeight={600} color="text.secondary">{row.aspect}</Typography></Box>
                <Box component="td"><Typography variant="body2">{row.tanstack}</Typography></Box>
                <Box component="td"><Typography variant="body2">{row.rtk}</Typography></Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const INTRO = (
  <Stack spacing={0.5} component="span" display="block">
    <span>
      Two libraries, one job: fetch and cache a paginated list of quotes from the dummyjson API. Both demos below make
      real network calls and use <strong>axios</strong> under the hood — so the only real difference is the caching
      wrapper. Toggle between them; each shows a live demo on top and an annotated implementation below.
    </span>
  </Stack>
);

export default function DataFetchingWalkthrough() {
  const items: WalkthroughItem[] = [
    {
      label: 'TanStack Query',
      demo: <TanstackQuotesDemo />,
      code: tanstackCode,
      filename: 'tanstack-quotes.tsx',
      annotations: tanstackAnnotations
    },
    {
      label: 'RTK Query',
      demo: <RtkQuotesDemo />,
      code: rtkCode,
      filename: 'rtk-quotes.tsx',
      annotations: rtkAnnotations
    }
  ];

  return (
    <DemoProviders>
      <WalkthroughLayout
        title="🔄 Data Fetching — TanStack Query vs RTK Query"
        intro={INTRO}
        items={items}
        comparison={<ComparisonStrip />}
      />
    </DemoProviders>
  );
}
