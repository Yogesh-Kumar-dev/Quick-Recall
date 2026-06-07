// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports — count content live so these never drift
import { jsNotes, tsNotes, tsReactNotes, jsProblems } from 'data/javascript';
import { reactNotes, reactMcProblems } from 'data/react';
import { reduxNotes, reduxToolkitNotes, rtkQueryNotes, asyncThunkNotes } from 'data/redux';
import { nextjsNotes, nextjsRenderingNotes } from 'data/nextjs';
import { htmlNotes, cssNotes } from 'data/htmlcss';
import { engineeringNotes } from 'data/engineering';

// ==============================|| LANDING - STATS ||============================== //

const totalNotes =
  jsNotes.length +
  tsNotes.length +
  tsReactNotes.length +
  reactNotes.length +
  reduxNotes.length +
  reduxToolkitNotes.length +
  rtkQueryNotes.length +
  asyncThunkNotes.length +
  nextjsNotes.length +
  nextjsRenderingNotes.length +
  htmlNotes.length +
  cssNotes.length +
  engineeringNotes.length;

const totalProblems = jsProblems.length + reactMcProblems.length;

const stats = [
  { value: `${totalNotes}+`, label: 'Concept notes' },
  { value: `${totalProblems}`, label: 'Machine-coding problems' },
  { value: '3', label: 'Live versions per problem' },
  { value: '7', label: 'Topics covered' }
];

export default function Stats() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: { xs: 4, md: 5 },
          px: { xs: 2, md: 4 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Grid container spacing={2}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <Stack spacing={0.5} alignItems="center" textAlign="center">
                <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
