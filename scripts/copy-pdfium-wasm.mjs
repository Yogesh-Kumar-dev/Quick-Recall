// Copies the PDFium WASM that ships with the installed EmbedPDF viewer into /public so it is served
// SAME-ORIGIN as /pdfium.wasm. EmbedPDF otherwise fetches this ~4.6 MB binary from the jsDelivr CDN
// at runtime, which (a) fails when the PWA is offline — the viewer can't initialise even though the
// PDF bytes are cached — and (b) can't be cached by our same-origin-only Serwist service worker.
// Self-hosting lets the SW precache it (see next.config.ts) so the viewer works fully offline. The
// .wasm is a static asset, not part of the JS bundle, so build size is unaffected.
//
// Runs before `next dev` / `next build` (see package.json). The source is resolved through the
// dependency chain (react-pdf-viewer → snippet → pdfium) so it always matches the installed version
// under pnpm's nested node_modules — never hard-code a version here.

import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function resolvePdfiumWasm() {
  // Walk the dependency chain, scoping each require to the previously resolved module's location,
  // so pnpm's strict (non-hoisted) layout resolves correctly.
  const fromRoot = createRequire(join(root, 'package.json'));
  const viewer = fromRoot.resolve('@embedpdf/react-pdf-viewer');
  const fromViewer = createRequire(viewer);
  const snippet = fromViewer.resolve('@embedpdf/snippet');
  const fromSnippet = createRequire(snippet);
  return fromSnippet.resolve('@embedpdf/pdfium/pdfium.wasm');
}

try {
  const src = resolvePdfiumWasm();
  const dest = join(root, 'public', 'pdfium.wasm');
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log(`[copy-pdfium-wasm] copied ${src} -> ${dest}`);
} catch (err) {
  console.error('[copy-pdfium-wasm] failed to copy PDFium WASM:', err);
  process.exit(1);
}
