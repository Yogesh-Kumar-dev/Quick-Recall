import { MARK_ACCENT, MARK_STROKE, MARK_VIEWBOX, RING_PATH, TAIL_PATH } from './mark-paths';

type LogoProps = {
  /** Rendered mark size in px. Below 16 the tail stops reading — don't. */
  size?: number;
  /** Append the "QuickRecall" wordmark to form the full lockup. */
  withWordmark?: boolean;
  className?: string;
};

/**
 * The one place the brand mark is rendered in-app. Every surface that shows QuickRecall itself
 * (sidebar, home hero) goes through this — the app used to wear three unrelated marks.
 *
 * The ring inherits `currentColor` so the mark sits in whatever text colour surrounds it; only the
 * tail is green. Don't wrap this in `text-primary`, that collapses the two-tone into a flat blob.
 */
export default function Logo({ size = 20, withWordmark = false, className }: LogoProps) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill="none"
      strokeWidth={MARK_STROKE}
      strokeLinecap="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={RING_PATH} stroke="currentColor" />
      <path d={TAIL_PATH} stroke={MARK_ACCENT} />
    </svg>
  );

  if (!withWordmark) return <span className={className}>{mark}</span>;

  return (
    <span className={`flex items-center gap-2 ${className ?? ''}`}>
      {mark}
      <span className="font-heading text-lg font-semibold">QuickRecall</span>
    </span>
  );
}
