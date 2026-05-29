'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IconSettings, IconX } from '@tabler/icons-react';

import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'config';
import { PresetColor } from 'types/config';

// ── Preset colour swatches ────────────────────────────────────────────────────

const PRESETS: { value: PresetColor; primary: string; secondary: string; label: string }[] = [
  { value: 'default', primary: '#2196f3', secondary: '#673ab7', label: 'Default' },
  { value: 'theme1',  primary: '#607d8b', secondary: '#009688', label: 'Theme 1' },
  { value: 'theme2',  primary: '#203461', secondary: '#ec407a', label: 'Theme 2' },
  { value: 'theme3',  primary: '#16595a', secondary: '#c77e23', label: 'Theme 3' },
  { value: 'theme4',  primary: '#173e43', secondary: '#3fb0ac', label: 'Theme 4' },
  { value: 'theme5',  primary: '#0a2342', secondary: '#2ca58d', label: 'Theme 5' },
  { value: 'theme6',  primary: '#3f51b5', secondary: '#3f51b5', label: 'Theme 6' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Customization() {
  const theme = useTheme();
  const { mode, presetColor, onChangeMode, onChangePresetColor } = useConfig();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating trigger button */}
      <Tooltip title="Theme settings" placement="left">
        <Fab
          size="medium"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1300,
            bgcolor: 'primary.main',
            color: '#fff',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: theme.shadows[8]
          }}
        >
          <IconSettings size={20} />
        </Fab>
      </Tooltip>

      {/* Settings drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 280, p: 0 } }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, bgcolor: 'primary.main' }}>
          <Typography variant="subtitle1" fontWeight={700} color="#fff">
            Theme Settings
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#fff' }}>
            <IconX size={18} />
          </IconButton>
        </Box>

        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* ── Mode toggle ── */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Mode
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
              {[
                { label: '☀️ Light', value: ThemeMode.LIGHT },
                { label: '🌙 Dark',  value: ThemeMode.DARK  },
              ].map(({ label, value }) => (
                <Box
                  key={value}
                  onClick={() => onChangeMode(value)}
                  sx={{
                    flex: 1,
                    py: 1,
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    border: '2px solid',
                    borderColor: mode === value ? 'primary.main' : 'divider',
                    bgcolor: mode === value ? 'primary.main' : 'background.paper',
                    color: mode === value ? '#fff' : 'text.primary',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* ── Preset colours ── */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Colour Preset
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mt: 1.5 }}>
              {PRESETS.map(({ value, primary, secondary, label }) => {
                const active = presetColor === value;
                return (
                  <Tooltip key={value} title={label} placement="top">
                    <Box
                      onClick={() => onChangePresetColor(value)}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: active ? primary : 'divider',
                        outline: active ? `3px solid ${primary}40` : 'none',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: primary }
                      }}
                    >
                      {/* Two-tone colour bar */}
                      <Box sx={{ display: 'flex', height: 36 }}>
                        <Box sx={{ flex: 1, bgcolor: primary }} />
                        <Box sx={{ flex: 1, bgcolor: secondary }} />
                      </Box>
                      <Box sx={{ px: 1, py: 0.5, bgcolor: 'background.paper' }}>
                        <Typography variant="caption" fontWeight={active ? 700 : 400} color={active ? primary : 'text.secondary'}>
                          {label}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>

        </Box>
      </Drawer>
    </>
  );
}
