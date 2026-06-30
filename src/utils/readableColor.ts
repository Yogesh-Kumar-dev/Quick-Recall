import { darken, decomposeColor, getContrastRatio, lighten, recomposeColor } from '@mui/material/styles';

// Flatten a semi-transparent `color` painted at `opacity` over a solid `background` into the
// resulting solid color. Card surfaces here tint the paper with `alpha(accent, 0.08)` etc., so the
// real background behind text is the composite — not the bare paper — and that's what must be used
// when measuring contrast.
export function flattenColor(color: string, opacity: number, background: string): string {
  const fg = decomposeColor(color).values;
  const bg = decomposeColor(background).values;
  const values = [0, 1, 2].map((i) => Math.round(opacity * fg[i] + (1 - opacity) * bg[i])) as [number, number, number];
  return recomposeColor({ type: 'rgb', values });
}

// Return `color` nudged in lightness (hue preserved) until it meets the WCAG `ratio` (AA 4.5:1 by
// default) against `background`. On a dark surface it lightens; on a light surface it darkens. If
// it already passes, it's returned unchanged. Used to keep brand-accent text legible on the dark
// topic cards where raw accents like Redux `#764abc` (2.4:1) fail.
export function readableColor(color: string, background: string, ratio = 4.5): string {
  try {
    if (getContrastRatio(color, background) >= ratio) return color;
    const goLighter = getContrastRatio('#fff', background) >= getContrastRatio('#000', background);
    let next = color;
    for (let i = 0; i < 20; i++) {
      next = goLighter ? lighten(next, 0.06) : darken(next, 0.06);
      if (getContrastRatio(next, background) >= ratio) break;
    }
    return next;
  } catch {
    return color;
  }
}
