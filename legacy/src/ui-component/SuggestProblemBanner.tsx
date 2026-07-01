'use client';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

// leafygreen (real MongoDB components)
import { LGButton, LGButtonVariant, LGCard } from 'ui-component/leafygreen';

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
    // Real MongoDB LeafyGreen Card as the surface; the responsive flex layout lives on an inner Box.
    <Box sx={sx}>
      <LGCard>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}
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

          <Box sx={{ flexShrink: 0 }}>
            <LGButton
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant={LGButtonVariant.Default}
              rightGlyph={<IconArrowRight size={18} />}
            >
              Suggest a problem
            </LGButton>
          </Box>
        </Box>
      </LGCard>
    </Box>
  );
}
