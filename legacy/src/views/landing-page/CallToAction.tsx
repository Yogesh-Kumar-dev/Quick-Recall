'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// next
import Link from 'next/link';

// assets
import { IconArrowRight } from '@tabler/icons-react';

// ==============================|| LANDING - CALL TO ACTION ||============================== //

export default function CallToAction() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          px: { xs: 4, md: 8 },
          py: { xs: 6, md: 9 },
          textAlign: 'center',
          color: 'common.white',
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(50% 80% at 50% 0%, rgba(255,255,255,0.18) 0%, transparent 70%)'
          }}
        />
        <Stack spacing={3} alignItems="center" sx={{ position: 'relative' }}>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.75rem' }, color: 'inherit' }}>
            Your next interview starts here
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 400, maxWidth: 560, color: 'rgba(255,255,255,0.85)' }}>
            Jump into the dashboard and start working through notes and problems at your own pace.
          </Typography>
          <Button
            component={Link}
            href="/dashboard"
            variant="contained"
            size="large"
            endIcon={<IconArrowRight size={18} />}
            sx={{
              mt: 1,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              bgcolor: 'common.white',
              color: 'primary.dark',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Open the dashboard
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
