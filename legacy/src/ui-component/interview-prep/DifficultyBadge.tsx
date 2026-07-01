import { LGBadge, LGBadgeVariant } from 'ui-component/leafygreen';
import type { ProblemDifficulty } from 'types/content';

// Real MongoDB LeafyGreen Badge — easy/medium/hard map to LeafyGreen's green/yellow/red variants.
const CONFIG: Record<ProblemDifficulty, { label: string; variant: (typeof LGBadgeVariant)[keyof typeof LGBadgeVariant] }> = {
  easy: { label: 'Easy', variant: LGBadgeVariant.Green },
  medium: { label: 'Medium', variant: LGBadgeVariant.Yellow },
  hard: { label: 'Hard', variant: LGBadgeVariant.Red }
};

interface DifficultyBadgeProps {
  difficulty: ProblemDifficulty;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { label, variant } = CONFIG[difficulty];
  return <LGBadge variant={variant}>{label}</LGBadge>;
}
