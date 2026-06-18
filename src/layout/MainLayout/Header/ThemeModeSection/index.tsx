'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import { IconSun, IconMoon } from '@tabler/icons-react';

// ==============================|| HEADER CONTENT - THEME MODE TOGGLE ||============================== //

export default function ThemeModeSection() {
  const theme = useTheme();
  const { mode, onChangeMode } = useConfig();

  const isDark = mode === ThemeMode.DARK;
  const handleToggle = () => onChangeMode(isDark ? ThemeMode.LIGHT : ThemeMode.DARK);

  return (
    <Box sx={{ ml: 2 }}>
      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <Avatar
          variant="rounded"
          role="button"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            border: '1px solid',
            borderColor: isDark ? 'dark.main' : 'primary.light',
            bgcolor: isDark ? 'dark.main' : 'primary.light',
            color: 'primary.dark',
            transition: 'all .2s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.main',
              color: 'primary.light'
            }
          }}
          onClick={handleToggle}
          color="inherit"
        >
          {isDark ? <IconSun stroke={1.5} size="20px" /> : <IconMoon stroke={1.5} size="20px" />}
        </Avatar>
      </Tooltip>
    </Box>
  );
}
