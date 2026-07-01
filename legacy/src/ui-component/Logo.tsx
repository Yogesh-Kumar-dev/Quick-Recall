'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project imports
import { ThemeMode } from 'config';

// ==============================|| LOGO — QuickRecall ||============================== //

export default function Logo() {
  const theme = useTheme();
  const isDark = theme.palette.mode === ThemeMode.DARK;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      {/* Lightning bolt accent */}
      <Box
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '7px',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          flexShrink: 0
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </Box>

      {/* Wordmark */}
      <Typography
        component="span"
        sx={{
          fontSize: '1.05rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: isDark ? theme.palette.common.white : theme.palette.grey[900],
          lineHeight: 1,
          userSelect: 'none'
        }}
      >
        Quick
        <Box component="span" sx={{ color: theme.palette.primary.main }}>
          Recall
        </Box>
      </Typography>
    </Box>
  );
}
