/**
 * "The Recall Loop" — QuickRecall's brand mark, as raw geometry.
 *
 * A near-closed ring (the spaced-repetition cycle) whose tail is one diagonal stroke breaking out
 * through the gap (retrieval). Reads as a Q at a glance, as a loop with an exit on the second read.
 *
 * This module is the single source of truth for the mark. Three renderers consume it — the in-app
 * <Logo>, the OG image, and scripts/gen-icons.mjs — so the mark can't drift between the app, the
 * favicon and social previews. Change the geometry here and re-run `node scripts/gen-icons.mjs`.
 *
 * Construction, on a 24-unit grid: ring centred (12,12) at r=7.5, with a gap spanning 25deg-60deg
 * (lower right). The tail runs along the 42deg ray — the middle of that gap — from r=3.0, well
 * inside the bowl, out to r=11.5, well clear of the ring.
 *
 * That crossing is the whole design, not a flourish. A tail that merely *touches* the ring and
 * points outward is a magnifying-glass handle, and the mark was unmistakably a search icon at
 * every size until the tail was extended back through the bowl. Shorten either end and it
 * collapses into a magnifier again.
 */

export const MARK_VIEWBOX = '0 0 24 24';

/** Stroke width in viewBox units. Tuned so the mark still reads at 16px — don't go below 2. */
export const MARK_STROKE = 2;

/** The cycle. Long way round (315deg), leaving the gap the tail exits through. */
export const RING_PATH = 'M15.75 18.5A7.5 7.5 0 1 1 18.8 15.17';

/** The retrieval stroke. The only part of the mark that ever carries the accent green. */
export const TAIL_PATH = 'M14.23 14.01L20.55 19.69';

/** green.base — see --primary in globals.css. Hardcoded because the mark's tail is always green,
 *  even on surfaces where the surrounding text colour changes. */
export const MARK_ACCENT = '#00ed64';
