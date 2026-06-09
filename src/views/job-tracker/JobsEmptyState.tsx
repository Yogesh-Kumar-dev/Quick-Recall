import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconBriefcase, IconPlus } from '@tabler/icons-react';

// ==============================|| JOB TRACKER - EMPTY STATE ||============================== //

interface JobsEmptyStateProps {
  onAdd: () => void;
}

export default function JobsEmptyState({ onAdd }: JobsEmptyStateProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 6, md: 10 },
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'primary.light',
          color: 'primary.main'
        }}
      >
        <IconBriefcase size={42} />
      </Box>
      <Box>
        <Typography variant="h3" gutterBottom>
          No job applications yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
          Track every role you apply to — company, recruiter contacts, and where you found it — all in one place.
        </Typography>
      </Box>
      <Button variant="contained" size="large" startIcon={<IconPlus size={18} />} onClick={onAdd}>
        Add your first job
      </Button>
    </Box>
  );
}
