// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// next
import Link from 'next/link';

// ==============================|| LANDING PAGE ||============================== //

export default function LandingPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
        px: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant="h1" fontWeight={700}>
        QuickRecall
      </Typography>
      <Typography variant="h5" color="text.secondary" maxWidth={480}>
        Your go-to platform for interview prep and quick revision.
      </Typography>
      <Button component={Link} href="/dashboard" variant="contained" size="large" sx={{ mt: 2, px: 5, py: 1.5 }}>
        Go to Dashboard
      </Button>
    </Box>
  );
}
