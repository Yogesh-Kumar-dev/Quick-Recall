import Chip from '@mui/material/Chip';
import type { ProblemDifficulty } from 'types/content';

const CONFIG: Record<ProblemDifficulty, { label: string; color: 'success' | 'warning' | 'error' }> = {
  easy: { label: 'Easy', color: 'success' },
  medium: { label: 'Medium', color: 'warning' },
  hard: { label: 'Hard', color: 'error' }
};

interface DifficultyBadgeProps {
  difficulty: ProblemDifficulty;
  size?: 'small' | 'medium';
}

export default function DifficultyBadge({ difficulty, size = 'small' }: DifficultyBadgeProps) {
  const { label, color } = CONFIG[difficulty];
  return <Chip label={label} color={color} size={size} variant="outlined" />;
}
