import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface SectionLink {
  label: string;
  href: string;
  badge?: string; // e.g. "19 ✓"
}

interface SectionLandingCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  links: SectionLink[];
  accentColor?: string; // MUI palette key or hex
}

export default function SectionLandingCard({ icon, title, description, links, accentColor = 'primary.main' }: SectionLandingCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 }
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
          <Box sx={{ color: accentColor, display: 'flex', alignItems: 'center' }}>{icon}</Box>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2.5}>
          {description}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Links */}
        <Stack spacing={1}>
          {links.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              variant="text"
              fullWidth
              endIcon={
                link.badge ? (
                  <Chip label={link.badge} size="small" color="success" sx={{ height: 20, fontSize: 11 }} />
                ) : (
                  <IconArrowRight size={16} />
                )
              }
              sx={{
                justifyContent: 'space-between',
                textAlign: 'left',
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                fontWeight: 500,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
