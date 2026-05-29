'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';

export default function CustomHooksPage() {
  return (
    <MainCard title="🪝 Custom Hooks">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom color="text.secondary">
          Content coming soon
        </Typography>
        <Typography variant="body2" color="text.disabled">
          useFetch, useDebounce, useLocalStorage, useIntersectionObserver, and more.
        </Typography>
      </Box>
    </MainCard>
  );
}
