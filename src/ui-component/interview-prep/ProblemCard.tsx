import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import type { BaseProblemEntry } from 'types/content';

const ACCENT_COLOR: Record<string, string> = {
  easy: '#4caf50',
  medium: '#ff9800',
  hard: '#f44336'
};

const DIFF_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'error' }> = {
  easy: { label: 'Easy', color: 'success' },
  medium: { label: 'Medium', color: 'warning' },
  hard: { label: 'Hard', color: 'error' }
};

interface ProblemCardProps {
  problem: BaseProblemEntry;
  basePath?: string;
  categoryLabel?: string;
  categoryEmoji?: string;
}

export default function ProblemCard({ problem, basePath = '/js/machine-coding', categoryLabel, categoryEmoji }: ProblemCardProps) {
  const accentColor = ACCENT_COLOR[problem.difficulty] ?? '#9e9e9e';
  const diff = DIFF_CONFIG[problem.difficulty];
  const catLabel = categoryLabel ?? problem.category.charAt(0).toUpperCase() + problem.category.slice(1);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderLeft: `3px solid ${accentColor}`,
        transition: 'box-shadow 0.18s',
        '&:hover': { boxShadow: 2 }
      }}
    >
      <CardActionArea component={Link} href={`${basePath}/${problem.slug}`}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }} noWrap>
                  {problem.title}
                </Typography>
                <Chip
                  label={categoryEmoji ? `${categoryEmoji} ${catLabel}` : catLabel}
                  size="small"
                  variant="outlined"
                  sx={{ flexShrink: 0, fontSize: 12 }}
                />
              </Box>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap alignItems="center">
                {diff && <Chip label={diff.label} size="small" color={diff.color} variant="outlined" sx={{ fontSize: 11, fontWeight: 600 }} />}
                {problem.tags.slice(0, 3).map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: 11, color: 'text.secondary', borderColor: 'divider' }} />
                ))}
              </Stack>
            </Box>
            <IconArrowRight size={18} style={{ flexShrink: 0, opacity: 0.35 }} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
