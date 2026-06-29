// ==============================|| PDF GUIDES (per page) ||============================== //
//
// PDF "tip sheet" guides surfaced via the <PdfLauncher> (a header icon → bottom drawer with the
// EmbedPDF viewer), mirroring how `video-playlists.ts` feeds <PlaylistLauncher>. One ordered array
// per page; pass the relevant array to the launcher on that page.
//
// Files live in **Vercel Blob storage** (public URLs), NOT in /public — keeping them out of the
// build keeps build size down. On first open the viewer downloads a guide once and caches it in a
// dedicated `pdf-cache` bucket (see src/hooks/usePdfCache.ts), then serves from cache forever
// (offline-friendly, minimal Blob egress).
//
// Updating a PDF: re-upload to Vercel Blob — the new public URL carries a fresh random suffix, so
// just paste the new `url` here. The changed URL is a natural cache miss → clients re-fetch once;
// the stale entry is auto-pruned (prunePdfCache). No version field needed.

export interface PdfGuide {
  // Stable id — used as the EmbedPDF document id (dedupes tabs) and React key. Keep it constant
  // across URL changes for the same logical guide.
  id: string;
  // Tab label / picker title.
  title: string;
  // Public Vercel Blob URL.
  url: string;
  // Optional human-readable size shown in the picker (e.g. '2.3 MB').
  sizeLabel?: string;
}

// JS Quick Recall companion tip sheets.
export const JS_QUICK_RECALL_PDFS: PdfGuide[] = [
  {
    id: 'js-best-practices',
    title: 'Best Practices',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/Js%20best%20practices%20.pdf'
  },
  {
    id: 'js-advanced-concepts',
    title: 'Advanced Concepts',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/Javascript%20Advanced%20Concepts%20.pdf'
  },
  {
    id: 'js-cheatsheet-beginners',
    title: 'Beginner Cheat Sheet',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/JavaScript%20Cheat%20Sheet%20for%20beginners.pdf'
  },
  {
    id: 'js-cheatsheet',
    title: 'Cheat Sheet',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/JavaScript%20CheatSheet%20%F0%9F%94%A5.pdf'
  },
  {
    id: 'js-code-snippets-75',
    title: '75 Code Snippets',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/75%20Useful%20JavaScript%20Code%20Snippets%20for%20Your%20Next%20Project.pdf'
  },
  {
    id: 'js-common-qna',
    title: 'Common Q&A',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/JavaScript%20Common%20QnA.pdf'
  },
  {
    id: 'js-array-methods',
    title: 'Array Methods',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/Array%20methods%20in%20JavaScript.pdf'
  },
  {
    id: 'js-array-methods-cheatsheet',
    title: 'Array Methods Cheatsheet',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/JavaScript%20Array%20Methods%F0%9F%92%AB.pdf'
  },
  {
    id: 'js-object-methods',
    title: 'Object Methods',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/Important%20JavaScript%20Object%20Method%20.pdf'
  },
  {
    id: 'js-date-methods',
    title: 'Date Methods',
    url: 'https://794uh0torwo6zts4.public.blob.vercel-storage.com/pdfs/Javascript%20Date%20Methods%20.pdf'
  }
  // append more PDFs here; add new arrays (REACT_*, TS_*, …) for other pages
];

// Every guide across the app. Keep this in sync when adding new per-page arrays — it's the set of
// URLs the cache prune treats as "still referenced", so anything not listed here is evicted from
// `pdf-cache`. (Pruning per-page would wrongly drop other pages' cached PDFs.)
export const ALL_PDF_GUIDES: PdfGuide[] = [...JS_QUICK_RECALL_PDFS];
export const ALL_PDF_GUIDE_URLS: string[] = ALL_PDF_GUIDES.map((g) => g.url);
