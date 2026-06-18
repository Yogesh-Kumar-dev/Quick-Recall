// material-ui
import { alpha, type Theme } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';

// LeafyGreen favors light, neutral elevation (and borders over heavy shadows). The colored
// shadow keys are kept for consumer compatibility but use a soft neutral tint instead of
// saturated brand colors so cards/menus don't pick up a colored halo.
function createCustomShadow(theme: Theme, color: string) {
  const soft = alpha(color, 0.12);
  const softer = alpha(color, 0.08);
  return {
    z1: `0 1px 2px 0 ${soft}`,
    z8: `0 4px 12px 0 ${soft}`,
    z12: `0 6px 16px 0 ${soft}`,
    z16: `0 0 2px 0 ${softer}, 0 10px 24px -6px ${soft}`,
    z20: `0 0 2px 0 ${softer}, 0 14px 30px -6px ${soft}`,
    z24: `0 0 4px 0 ${softer}, 0 18px 40px 0 ${soft}`,

    primary: `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.18)}`,
    secondary: `0 4px 12px 0 ${alpha(theme.palette.secondary.main, 0.18)}`,
    orange: `0 4px 12px 0 ${alpha(theme.palette.orange.main, 0.18)}`,
    success: `0 4px 12px 0 ${alpha(theme.palette.success.main, 0.18)}`,
    warning: `0 4px 12px 0 ${alpha(theme.palette.warning.main, 0.18)}`,
    error: `0 4px 12px 0 ${alpha(theme.palette.error.main, 0.18)}`
  };
}

export default function customShadows(mode: ThemeMode, theme: Theme) {
  return mode === ThemeMode.DARK
    ? createCustomShadow(theme, theme.palette.common.black)
    : createCustomShadow(theme, theme.palette.grey[900]);
}
