'use client';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { JsProblemMeta } from 'types/content';

type JsProblemStatementProps = Omit<JsProblemMeta, 'title'>;

export default function JsProblemStatement({ description, examples, constraints, interviewTip, tags }: JsProblemStatementProps) {
  return (
    <Box>
      {/* Description */}
      <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>

      {/* Examples */}
      <Typography variant="subtitle2" mb={1}>
        Examples:
      </Typography>
      <Stack spacing={1} mb={2}>
        {examples.map((ex, i) => (
          <Box
            key={i}
            sx={{
              p: 1.25,
              borderRadius: 1,
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              fontFamily: 'monospace',
              fontSize: 13
            }}
          >
            <Box>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                Input:{' '}
              </Typography>
              <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', color: 'info.main' }}>
                {ex.input}
              </Typography>
            </Box>
            <Box>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                Output:{' '}
              </Typography>
              <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', color: 'success.main' }}>
                {ex.output}
              </Typography>
            </Box>
            {ex.explanation && (
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.25 }}>
                // {ex.explanation}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>

      {/* Constraints */}
      {constraints && constraints.length > 0 && (
        <>
          <Typography variant="subtitle2" mb={0.5}>
            Constraints:
          </Typography>
          <Box component="ul" sx={{ mt: 0, mb: 2, pl: 2.5 }}>
            {constraints.map((c, i) => (
              <li key={i}>
                <Typography variant="body2" color="text.secondary">
                  {c}
                </Typography>
              </li>
            ))}
          </Box>
        </>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mb={2}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" color="primary" />
          ))}
        </Stack>
      )}

      {/* Interview Tip */}
      <Box sx={{ p: 1.5, bgcolor: '#fff8e1', borderRadius: 1, border: '1px solid #ffe082' }}>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          💡 <strong>Interview Tip:</strong> {interviewTip}
        </Typography>
      </Box>
    </Box>
  );
}
