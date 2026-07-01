// ==============================|| VIDEO PLAYLISTS (per page) ||============================== //

// We store YouTube **playlist URLs only** (not individual video IDs) — the IFrame player
// auto-sequences each playlist, and we chain to the next playlist when one finishes. The player
// adapts its frame per video (portrait for Shorts, landscape for regular videos), so these lists
// can mix both. To add more videos, append another playlist URL to the relevant ordered array.

// JS Machine Coding companion playlists. Order matters: when one playlist's last video ends, the
// player rolls into the next playlist's first video.
export const JS_MACHINE_CODING_PLAYLISTS: string[] = [
  'https://youtube.com/playlist?list=PLsjpRo2EZP1Ks5xz48DMabu5F-kqbwM7E',
  'https://youtube.com/playlist?list=PLKhlp2qtUcSaCVJEt4ogEFs6I41pNnMU5',
  'https://youtube.com/playlist?list=PLAgJNt0flqKduy3VuZbR76f8pMxGjz33X',
  'https://youtube.com/playlist?list=PLkFShEMrLia2M29wVSoIVISBSOmidHpeh&si=9t9xfHiH345MaMOb'
];

// JS Notes landing-page companion playlist(s).
export const JS_NOTES_PLAYLISTS: string[] = [
  'https://youtube.com/playlist?list=PLkFShEMrLia1kA3xjW6QYL1B3d_rEDVNL',
  'https://youtube.com/playlist?list=PLkFShEMrLia3CcVpGIHMdjTlShsb-uLcA&si=smkwW4xH69czzoZ4'
];

// TypeScript for React landing-page companion playlist(s).
export const TS_FOR_REACT_PLAYLISTS: string[] = ['https://youtube.com/playlist?list=PLS3cid0RQsvBbPmKvlMVact-S4Bz3moAs'];

// TypeScript Notes landing-page companion playlist(s).
export const TS_NOTES_PLAYLISTS: string[] = ['https://youtube.com/playlist?list=PL7mmJtzxud9iod4BLHxJfQsdShZE_Fb0C'];

// React Machine Coding companion playlists. Same ordering rule as above.
export const REACT_MACHINE_CODING_PLAYLISTS: string[] = [
  'https://youtube.com/playlist?list=PLlasXeu85E9cciv04MYWscodnbRFqACsH',
  'https://youtube.com/playlist?list=PLKhlp2qtUcSYQojD5G-ElgHezoCyq2Hgo',
  'https://youtube.com/playlist?list=PLQOMi2yb4hF2F4G_pA8fHSupjDG92CuU7',
  'https://youtube.com/playlist?list=PLnNsQf3QlMxXD9Vnd4SeIsO0WszaZoEg9'
];

// ─── Instagram links (per page) ──────────────────────────────────────────────
// Instagram can't be embedded (it blocks iframing), so these are plain external links opened in a
// new tab via the InstagramLauncher icon. Each link has a `label` shown in the dropdown when a page
// has more than one; a single link opens directly on click. Leave a page's array empty to hide the
// icon there.

export interface InstagramLink {
  label: string; // shown in the dropdown menu (multi-link pages)
  url: string;
}

// JS Notes landing-page Instagram links.
export const JS_NOTES_INSTAGRAM: InstagramLink[] = [
  { label: 'javascript.js', url: 'https://www.instagram.com/javascript.js/reels/' },
  { label: 'coding.stella', url: 'https://www.instagram.com/coding.stella/reels/' }
];

// React Notes landing-page Instagram links.
export const REACT_NOTES_INSTAGRAM: InstagramLink[] = [
  { label: 'reactjs1', url: 'https://www.instagram.com/reactjs1/reels/' },
  { label: 'roadsidecoder', url: 'https://www.instagram.com/roadsidecoder/reels/' },
  { label: 'allahabadi.dev', url: 'https://www.instagram.com/allahabadi.dev/reels/' }
];

// TypeScript Notes landing-page Instagram links.
export const TS_NOTES_INSTAGRAM: InstagramLink[] = [{ label: 'developertomek', url: 'https://www.instagram.com/developertomek/reels/' }];

// Dashboard (home) Instagram links.
export const DASHBOARD_INSTAGRAM: InstagramLink[] = [
  { label: 'coding_.master', url: 'https://www.instagram.com/coding_.master/reels/' },
  { label: 'coders_section', url: 'https://www.instagram.com/coders_section/' },
  { label: 'coding.artist', url: 'https://www.instagram.com/coding.artist/reels/' },
  { label: 'greatfrontend', url: 'https://www.instagram.com/greatfrontend/reels/' },
  { label: 'itsnextwork', url: 'https://www.instagram.com/itsnextwork/reels/' }
];

// Pull the `list` query param out of a YouTube playlist URL → the playlist ID the IFrame API
// needs. Returns null for anything without a parseable `list` so callers can skip it.
//   'https://youtube.com/playlist?list=PLxxxx'        → 'PLxxxx'
//   'https://www.youtube.com/watch?v=abc&list=PLxxxx' → 'PLxxxx'
export function extractPlaylistId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const list = parsed.searchParams.get('list');
    return list && list.trim() ? list.trim() : null;
  } catch {
    // Not a full URL — fall back to a regex (handles a bare `list=...` fragment).
    const match = url.match(/[?&]list=([^&\s]+)/);
    return match ? match[1] : null;
  }
}
