import { alpha } from '@mui/material/styles';
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

export interface TopicStat {
  label: string;
  value: number | string;
}

export interface TopicQuickLink {
  label: string;
  href: string;
}

interface TopicStatCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor: string;
  stats: TopicStat[];
  difficulty?: { easy: number; medium: number; hard: number };
  quickLinks: TopicQuickLink[];
  primaryHref: string;
}

const DIFF_COLORS = { easy: '#4caf50', medium: '#ffc107', hard: '#f44336' };

export default function TopicStatCard({
  icon,
  title,
  description,
  accentColor,
  stats,
  difficulty,
  quickLinks,
  primaryHref
}: TopicStatCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderTop: `3px solid ${accentColor}`,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 }
      }}
    >
      <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.25}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              bgcolor: alpha(accentColor, 0.12),
              border: '1px solid',
              borderColor: alpha(accentColor, 0.28),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor,
              flexShrink: 0
            }}
          >
            {icon}
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>

        {/* Stat tiles */}
        <Stack direction="row" spacing={1.5} mb={difficulty ? 1.5 : 2}>
          {stats.map((s) => (
            <Box
              key={s.label}
              sx={{
                flex: 1,
                py: 1,
                px: 1.25,
                borderRadius: 1.5,
                bgcolor: alpha(accentColor, 0.08),
                border: '1px solid',
                borderColor: alpha(accentColor, 0.18)
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ color: accentColor, lineHeight: 1.1 }}>
                {s.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {s.label}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Difficulty breakdown */}
        {difficulty && (
          <Stack direction="row" spacing={1} mb={2}>
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <Chip
                key={d}
                size="small"
                label={`${difficulty[d]} ${d}`}
                sx={{
                  height: 22,
                  fontSize: 11,
                  textTransform: 'capitalize',
                  bgcolor: alpha(DIFF_COLORS[d], 0.12),
                  color: DIFF_COLORS[d],
                  border: '1px solid',
                  borderColor: alpha(DIFF_COLORS[d], 0.3)
                }}
              />
            ))}
          </Stack>
        )}

        <Divider sx={{ mb: 1.5 }} />

        {/* Quick links */}
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mb={2}>
          {quickLinks.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              variant="text"
              size="small"
              sx={{
                px: 1,
                py: 0.25,
                minWidth: 0,
                borderRadius: 1,
                fontWeight: 500,
                fontSize: 12,
                color: 'text.secondary',
                '&:hover': { bgcolor: alpha(accentColor, 0.08), color: accentColor }
              }}
            >
              {link.label}
            </Button>
          ))}
        </Stack>

        {/* Primary CTA */}
        <Button
          component={Link}
          href={primaryHref}
          variant="outlined"
          fullWidth
          endIcon={<IconArrowRight size={16} />}
          sx={{
            mt: 'auto',
            borderRadius: 1.5,
            fontWeight: 600,
            color: accentColor,
            borderColor: alpha(accentColor, 0.5),
            '&:hover': { borderColor: accentColor, bgcolor: alpha(accentColor, 0.08) }
          }}
        >
          Open {title}
        </Button>
      </CardContent>
    </Card>
  );
}
