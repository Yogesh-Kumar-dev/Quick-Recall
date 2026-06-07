'use client';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

// icons
import { IconBulb, IconArrowRight } from '@tabler/icons-react';

// ─── Single source of truth: the portfolio's Gmail-backed contact form ──────────
export const CONTACT_URL = 'https://yogesh-kumar-portfolio-v2.vercel.app/#contact';

interface SuggestProblemBannerProps {
  sx?: SxProps<Theme>;
}

// ==============================|| SUGGEST A PROBLEM — BANNER ||============================== //

export default function SuggestProblemBanner({ sx }: SuggestProblemBannerProps) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          p: 2.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ color: 'primary.main', display: 'flex' }}>
          <IconBulb size={24} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Missing a problem?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suggest a machine-coding problem you&apos;d like to see added here.
          </Typography>
        </Box>
      </Stack>

      <Button
        href={CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        endIcon={<IconArrowRight size={18} />}
        sx={{ flexShrink: 0, borderRadius: 2, fontWeight: 600 }}
      >
        Suggest a problem
      </Button>
    </Box>
  );
}
