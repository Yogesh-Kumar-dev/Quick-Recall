import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createSerwistRoute } from '@serwist/turbopack';

// Precache revision for the self-hosted PDFium WASM, so it's re-fetched only when it changes.
function pdfiumWasmRevision(): string {
  try {
    const buf = readFileSync(path.join(process.cwd(), 'public', 'pdfium.wasm'));
    return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  } catch {
    return 'pdfium-missing';
  }
}

// Compiles src/app/sw.ts into the service worker served at /serwist/sw.js — Turbopack has no
// webpack-style plugin hook, so @serwist/turbopack compiles it on request via this Route Handler.
// additionalPrecacheEntries is dropped in dev by @serwist/turbopack, so only production builds see it.
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  // esbuild-wasm rejects Windows-style paths ("cwd is not an absolute path"); native esbuild doesn't.
  useNativeEsbuild: true,
  additionalPrecacheEntries: [
    { url: '/~offline', revision: process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString() },
    { url: '/pdfium.wasm', revision: pdfiumWasmRevision() }
  ],
  // pdfium.wasm (~4.6MB) is over the default maximumFileSizeToCacheInBytes and would just
  // warn-skip in the auto-glob; it's precached above instead, so exclude it here.
  globIgnores: ['**/pdfium.wasm']
});
