import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { ThemeMode } from 'config';

// Shared LeafyGreen-style segmented-control (pill) styling for the machine-coding toolbars:
// Preview|Code / Details|Code toggles and the version / approach selectors.
//
// Mode-aware. LeafyGreen's SegmentedControl doesn't assume light-mode colors — in dark mode it
// uses a DARK track and keeps UNSELECTED labels at a near-white gray (not a dim secondary) so they
// stay clearly legible. The earlier version washed out because it used `text.secondary` / a mid
// gray for the unselected label on a dark track.
//
// We use explicit `mode` ternaries (not theme.applyStyles) here: applyStyles wraps rules in a
// `[data-mui-color-scheme]` :where() selector which, nested under `& .MuiToggleButton-root`, was
// being out-specified by MUI's own ToggleButton color defaults — so the dark override never took.
// Typed as a theme callback (not SxProps) so it composes inside an sx array, e.g.
// sx={[segmentedControlSx, { overflowX: 'auto' }]} — SxProps can itself be an array, which TS
// rejects when nested.
export const segmentedControlSx = (theme: Theme): SystemStyleObject<Theme> => {
  const isDark = theme.palette.mode === ThemeMode.DARK;

  return {
    borderRadius: 999,
    p: '3px',
    // light track in light mode; dark track (distinct from the #112733 surface) in dark mode
    bgcolor: isDark ? theme.palette.dark.main : theme.palette.grey[100],
    '& .MuiToggleButton-root': {
      border: 0,
      borderRadius: '999px !important',
      px: 2,
      py: 0.25,
      fontSize: 13,
      fontWeight: 600,
      textTransform: 'none',
      // Unselected label — high contrast in BOTH modes.
      color: isDark ? theme.palette.grey[50] : theme.palette.text.secondary,
      '&:hover': {
        color: isDark ? theme.palette.common.white : theme.palette.text.primary,
        backgroundColor: 'transparent'
      },
      '&.Mui-selected': {
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        '&:hover': { bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }
      }
    }
  };
};
