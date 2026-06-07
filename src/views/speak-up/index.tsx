import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SpeechPractice from 'ui-component/interview-prep/SpeechPractice';

// ==============================|| SPEAK UP PAGE ||============================== //

export default function SpeakUpPage() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Speak Up
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Practice speaking your answers out loud — click the mic and rehearse common interview questions.
        </Typography>
      </Box>

      {/* Speech practice */}
      <SpeechPractice />
    </Box>
  );
}
