'use client';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface ProblemMeta {
  title: string;
  description: string;
  requirements: string[];
  keyPatterns: string[];
  interviewTip: string;
}

type ProblemStatementProps = Omit<ProblemMeta, 'title'>;

export default function ProblemStatement({ description, requirements, keyPatterns, interviewTip }: ProblemStatementProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>

      <Typography variant="subtitle2" mb={0.5}>
        Requirements:
      </Typography>
      <Box component="ul" sx={{ mt: 0, mb: 2, pl: 2.5 }}>
        {requirements.map((r, i) => (
          <li key={i}>
            <Typography variant="body2" color="text.secondary">
              {r}
            </Typography>
          </li>
        ))}
      </Box>

      <Typography variant="subtitle2" mb={1}>
        Key Patterns:
      </Typography>
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mb={2}>
        {keyPatterns.map((p) => (
          <Chip key={p} label={p} size="small" color="primary" variant="outlined" />
        ))}
      </Stack>

      <Box sx={{ p: 1.5, bgcolor: '#fff8e1', borderRadius: 1, border: '1px solid #ffe082' }}>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          💡 <strong>Interview Tip:</strong> {interviewTip}
        </Typography>
      </Box>
    </Box>
  );
}
