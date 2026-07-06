import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createSerwistRoute } from '@serwist/turbopack';

// Content hash of the self-hosted PDFium WASM (see scripts/copy-pdfium-wasm.mjs). Used as the
// precache revision so the service worker re-fetches the binary only when it actually changes
// (e.g. an EmbedPDF version bump). Falls back to a constant if the file isn't present yet.
function pdfiumWasmRevision(): string {
  try {
    const buf = readFileSync(path.join(process.cwd(), 'public', 'pdfium.wasm'));
    return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  } catch {
    return 'pdfium-missing';
  }
}

// Compiles src/app/sw.ts into the service worker served at /serwist/sw.js (Turbopack has no
// webpack-style plugin hook, so @serwist/turbopack instead compiles the worker on request via
// this Route Handler — see next.config.ts). additionalPrecacheEntries is dropped entirely in
// dev by @serwist/turbopack itself, so this only matters for production builds.
//
// /~offline: the navigation fallback. /pdfium.wasm: the EmbedPDF engine, self-hosted and
// precached so the PDF viewer initialises offline (it is fetched cross-origin from a CDN by
// default — see scripts/copy-pdfium-wasm.mjs). Its revision is the file's content hash so it
// busts only on change.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  // esbuild-wasm rejects Windows-style paths ("cwd is not an absolute path") when resolving
  // `process.cwd()` for the output dir — native esbuild handles them fine, and pnpm resolves the
  // correct platform binary automatically in production too.
  useNativeEsbuild: true,
  additionalPrecacheEntries: [
    { url: '/~offline', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString() },
    { url: '/pdfium.wasm', revision: pdfiumWasmRevision() }
  ],
  // The auto-glob over public/ would also pick up pdfium.wasm (~4.6MB, over the default
  // maximumFileSizeToCacheInBytes) and just warn-skip it — it's precached above instead, with a
  // content-hash revision, so exclude it from the glob scan to silence that redundant warning.
  globIgnores: ['**/pdfium.wasm']
});
