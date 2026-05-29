'use client';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ApproachData } from 'types/content';

interface ApproachDetailsProps {
  approach: ApproachData;
}

export default function ApproachDetails({ approach }: ApproachDetailsProps) {
  return (
    <Box sx={{ height: '100%', overflowY: 'auto', p: 2.5 }}>
      {/* Approach description */}
      <Typography variant="body2" color="text.secondary" mb={2.5} sx={{ lineHeight: 1.7 }}>
        {approach.description}
      </Typography>

      {/* Complexity */}
      <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5} display="block" mb={1}>
        Complexity
      </Typography>
      <Stack direction="row" spacing={1} mb={2.5}>
        <Chip
          icon={<span style={{ fontSize: 14, marginLeft: 6 }}>⏱</span>}
          label={`Time: ${approach.timeComplexity}`}
          size="small"
          variant="outlined"
          color="primary"
          sx={{ fontFamily: 'monospace', fontWeight: 600 }}
        />
        <Chip
          icon={<span style={{ fontSize: 14, marginLeft: 6 }}>🗄</span>}
          label={`Space: ${approach.spaceComplexity}`}
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ fontFamily: 'monospace', fontWeight: 600 }}
        />
      </Stack>

      {/* Pros */}
      {approach.pros && approach.pros.length > 0 && (
        <>
          <Typography variant="caption" fontWeight={700} color="success.main" textTransform="uppercase" letterSpacing={0.5} display="block" mb={0.5}>
            ✅ Pros
          </Typography>
          <Box component="ul" sx={{ mt: 0, mb: 2, pl: 2.5 }}>
            {approach.pros.map((p, i) => (
              <li key={i}>
                <Typography variant="body2" color="text.secondary">
                  {p}
                </Typography>
              </li>
            ))}
          </Box>
        </>
      )}

      {/* Cons */}
      {approach.cons && approach.cons.length > 0 && (
        <>
          <Typography variant="caption" fontWeight={700} color="error.main" textTransform="uppercase" letterSpacing={0.5} display="block" mb={0.5}>
            ❌ Cons
          </Typography>
          <Box component="ul" sx={{ mt: 0, pl: 2.5 }}>
            {approach.cons.map((c, i) => (
              <li key={i}>
                <Typography variant="body2" color="text.secondary">
                  {c}
                </Typography>
              </li>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
