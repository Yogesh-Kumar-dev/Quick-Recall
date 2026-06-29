'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IconCheck, IconExternalLink } from '@tabler/icons-react';

import type { DocumentManagerCapability, PDFViewerConfig, PluginRegistry } from '@embedpdf/react-pdf-viewer';
import { ALL_PDF_GUIDE_URLS, type PdfGuide } from 'data/pdf-guides';
import { ensurePdfBuffer, prunePdfCache, requestPersistentStorage } from 'utils/pdf-cache';

// The EmbedPDF viewer is browser-only (Canvas + WebAssembly) — load it client-side so it never runs
// during SSR.
const PDFViewer = dynamic(() => import('@embedpdf/react-pdf-viewer').then((m) => m.PDFViewer), { ssr: false });

// EmbedPDF's DocumentManager plugin id (avoid importing the plugin class so the EmbedPDF runtime stays
// out of the SSR/server bundle — only the dynamic import above pulls it in, in the browser).
const DOC_MANAGER_ID = 'document-manager';

interface PdfViewerPanelProps {
  guides: PdfGuide[];
}

// Hosts the EmbedPDF viewer (browser-style tab bar) and drives it from our cache:
//   pick a guide → ensurePdfBuffer (one network fetch ever, else from `pdf-cache`) → openDocumentBuffer.
// The viewer is mounted once and persists across guide switches; the first guide auto-opens so the
// drawer shows a PDF immediately. Nothing downloads until a guide is opened.
export default function PdfViewerPanel({ guides }: PdfViewerPanelProps) {
  const { palette } = useTheme();
  const registryRef = useRef<PluginRegistry | null>(null);
  const [ready, setReady] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<{ id: string; message: string } | null>(null);

  // Best-effort, once per mount: make storage persistent and drop cached PDFs no longer referenced.
  useEffect(() => {
    void requestPersistentStorage();
    void prunePdfCache(ALL_PDF_GUIDE_URLS);
  }, []);

  const config = useMemo<PDFViewerConfig>(
    () => ({
      // Self-hosted engine (see scripts/copy-pdfium-wasm.mjs + next.config.ts). Absolute same-origin
      // URL so the worker resolves it correctly. Default would fetch this ~4.6 MB binary from a CDN.
      wasmUrl: typeof window !== 'undefined' ? `${window.location.origin}/pdfium.wasm` : '/pdfium.wasm',
      tabBar: 'always',
      theme: { preference: palette.mode },
      // No external font requests (jsDelivr fallback fonts + Google Fonts UI font) → offline-safe and
      // no third-party calls; the viewer UI falls back to the system font stack.
      fontFallback: null,
      fonts: { ui: null, signature: null }
    }),
    [palette.mode]
  );

  const openGuide = useCallback(async (guide: PdfGuide) => {
    const registry = registryRef.current;
    const docManager = (registry?.getPlugin(DOC_MANAGER_ID)?.provides?.() as DocumentManagerCapability | undefined) ?? null;
    if (!docManager) return;

    setError(null);
    if (docManager.isDocumentOpen(guide.id)) {
      docManager.setActiveDocument(guide.id); // already a tab — just focus it (no fetch)
      return;
    }

    setLoadingId(guide.id);
    try {
      const buffer = await ensurePdfBuffer(guide.url);
      docManager.openDocumentBuffer({ buffer, name: guide.title, documentId: guide.id, autoActivate: true });
      setOpenIds((prev) => new Set(prev).add(guide.id));
    } catch {
      setError({ id: guide.id, message: 'Could not load this PDF. Check your connection and try again.' });
    } finally {
      setLoadingId(null);
    }
  }, []);

  const handleReady = useCallback(
    (registry: PluginRegistry) => {
      registryRef.current = registry;
      setReady(true);
      if (guides[0]) void openGuide(guides[0]); // show a PDF immediately
    },
    [guides, openGuide]
  );

  const errorGuide = error ? guides.find((g) => g.id === error.id) : undefined;
  const busy = !ready || loadingId !== null;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {guides.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ p: 1, overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {guides.map((guide) => {
            const isOpen = openIds.has(guide.id);
            return (
              <Chip
                key={guide.id}
                label={guide.title}
                size="small"
                clickable
                icon={isOpen ? <IconCheck size={14} /> : undefined}
                onClick={() => void openGuide(guide)}
                color={isOpen ? 'primary' : 'default'}
                variant={isOpen ? 'filled' : 'outlined'}
              />
            );
          })}
        </Stack>
      )}

      <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <PDFViewer config={config} onReady={handleReady} style={{ width: '100%', height: '100%' }} />

        {busy && !error && (
          <Overlay>
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              {ready ? 'Downloading once…' : 'Preparing viewer…'}
            </Typography>
          </Overlay>
        )}

        {error && (
          <Overlay>
            <Typography variant="body2" color="text.secondary">
              {error.message}
            </Typography>
            <Stack direction="row" spacing={1}>
              {errorGuide && (
                <Button size="small" variant="outlined" onClick={() => void openGuide(errorGuide)}>
                  Retry
                </Button>
              )}
              {errorGuide && (
                <Button
                  size="small"
                  variant="text"
                  endIcon={<IconExternalLink size={16} />}
                  component="a"
                  href={errorGuide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab
                </Button>
              )}
            </Stack>
          </Overlay>
        )}
      </Box>
    </Box>
  );
}

// Centered overlay on top of the viewer for loading / error states.
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      spacing={1.5}
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'background.default',
        zIndex: 1,
        p: 2,
        textAlign: 'center'
      }}
    >
      {children}
    </Stack>
  );
}
