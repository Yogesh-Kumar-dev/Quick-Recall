// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| LANDING - STATS ||============================== //

const stats = [
  { value: '105+', label: 'Concept notes' },
  { value: '28', label: 'Machine-coding problems' },
  { value: '3', label: 'Live versions per problem' },
  { value: '5', label: 'Topics covered' }
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
