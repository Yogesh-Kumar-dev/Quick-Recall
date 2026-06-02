import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import DifficultyBadge from './DifficultyBadge';
import type { BaseProblemEntry } from 'types/content';

interface ProblemListCardProps {
  problem: BaseProblemEntry;
  basePath?: string; // default: '/js/machine-coding'
}

export default function ProblemListCard({ problem, basePath = '/js/machine-coding' }: ProblemListCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, transition: 'box-shadow 0.18s', '&:hover': { boxShadow: 2 } }}>
      <CardActionArea component={Link} href={`${basePath}/${problem.slug}`}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={0.75} noWrap>
                {problem.title}
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                <DifficultyBadge difficulty={problem.difficulty} />
                <Chip label={problem.category} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                {problem.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: 11, color: 'text.secondary', borderColor: 'divider' }}
                  />
                ))}
              </Stack>
            </Box>
            <IconArrowRight size={20} style={{ flexShrink: 0, opacity: 0.4 }} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
