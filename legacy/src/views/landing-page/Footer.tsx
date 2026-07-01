'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// next
import NextLink from 'next/link';

// assets
import { IconBolt } from '@tabler/icons-react';

// ==============================|| LANDING - FOOTER ||============================== //

const links = [
  { label: 'JS & TS Notes', href: '/js/notes' },
  { label: 'React', href: '/react/notes' },
  { label: 'HTML & CSS', href: '/html-css/html' },
  { label: 'Machine Coding', href: '/react/machine-coding?difficulty=easy' },
  { label: 'Quick Recall', href: '/js/quick-recall' }
];

export default function Footer() {
  const theme = useTheme();

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }}
            >
              <IconBolt size={16} />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              QuickRecall
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            {links.map((link) => (
              <Link
                key={link.label}
                component={NextLink}
                href={link.href}
                underline="hover"
                color="text.secondary"
                sx={{ '&:hover': { color: 'text.primary' } }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
          © {new Date().getFullYear()} QuickRecall — interview prep for JavaScript, TypeScript, React & more.
        </Typography>
      </Container>
    </Box>
  );
}
