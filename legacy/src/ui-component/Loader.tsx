// material-ui
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

// ==============================|| LOADER ||============================== //

export default function Loader() {
  return (
    <Box role="status" aria-live="polite" sx={{ position: 'fixed', top: 0, left: 0, zIndex: 1301, width: '100%' }}>
      <LinearProgress color="primary" />
      <Box component="span" className="sr-only">
        Loading…
      </Box>
    </Box>
  );
}
