import { ImageResponse } from 'next/og';
import { MARK_ACCENT, MARK_STROKE, MARK_VIEWBOX, RING_PATH, TAIL_PATH } from '@/components/brand/mark-paths';

export const alt = 'QuickRecall — Answer, then know why.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori (behind ImageResponse) renders inline SVG unreliably but handles <img> data URIs cleanly,
// so the mark is inlined as one. Colours are explicit here — there's no `currentColor` to inherit.
const markDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" fill="none" stroke-width="${MARK_STROKE}" stroke-linecap="round">` +
    `<path d="${RING_PATH}" stroke="#e8edeb"/><path d="${TAIL_PATH}" stroke="${MARK_ACCENT}"/></svg>`
)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#001e2b',
        padding: '0 100px',
        color: '#e8edeb'
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: satori renders to a static PNG, next/image doesn't apply. */}
      <img src={markDataUri} width={132} height={132} alt="" />
      <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -2, marginTop: 36 }}>QuickRecall</div>
      <div style={{ fontSize: 36, color: '#c1c7c6', marginTop: 12 }}>Answer, then know why.</div>
      <div style={{ display: 'flex', width: 128, height: 6, background: MARK_ACCENT, marginTop: 48 }} />
    </div>,
    size
  );
}
