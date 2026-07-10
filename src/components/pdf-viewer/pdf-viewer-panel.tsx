'use client';

import { IconCheck, IconExternalLink, IconLoader2 } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ALL_PDF_GUIDE_URLS, type PdfGuide } from '@/data/pdf-guides';
import { ensurePdfBuffer, prunePdfCache, requestPersistentStorage } from '@/utils/pdf-cache';

import type { DocumentManagerCapability, PDFViewerConfig, PluginRegistry } from '@embedpdf/react-pdf-viewer';

// EmbedPDF is browser-only (Canvas + WebAssembly) — load client-side so it never runs during SSR.
const PDFViewer = dynamic(() => import('@embedpdf/react-pdf-viewer').then((m) => m.PDFViewer), { ssr: false });

// plugin id as a string (not the class) so the EmbedPDF runtime stays out of the SSR/server bundle
const DOC_MANAGER_ID = 'document-manager';

interface PdfViewerPanelProps {
  guides: PdfGuide[];
}

export default function PdfViewerPanel({ guides }: PdfViewerPanelProps) {
  const registryRef = useRef<PluginRegistry | null>(null);
  const [ready, setReady] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    void requestPersistentStorage();
    void prunePdfCache(ALL_PDF_GUIDE_URLS);
  }, []);

  const config = useMemo<PDFViewerConfig>(
    () => ({
      // self-hosted engine (scripts/copy-pdfium-wasm.mjs); absolute same-origin URL so the worker
      // resolves it — default would fetch this ~4.6 MB binary from a CDN
      wasmUrl: typeof window !== 'undefined' ? `${window.location.origin}/pdfium.wasm` : '/pdfium.wasm',
      tabBar: 'always',
      theme: { preference: 'dark' },
      // avoid jsDelivr/Google Fonts requests so the viewer stays offline-safe
      fontFallback: null,
      fonts: { ui: null, signature: null }
    }),
    []
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
    <div className="relative flex h-full w-full flex-col">
      {guides.length > 1 && (
        <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-border p-2">
          {guides.map((guide) => {
            const isOpen = openIds.has(guide.id);
            return (
              <button key={guide.id} type="button" onClick={() => void openGuide(guide)} className="shrink-0">
                <Badge variant={isOpen ? 'default' : 'outline'} className="cursor-pointer gap-1 whitespace-nowrap">
                  {isOpen && <IconCheck size={14} />}
                  {guide.title}
                </Badge>
              </button>
            );
          })}
        </div>
      )}

      <section aria-label="PDF document viewer" className="relative min-h-0 flex-1">
        <PDFViewer config={config} onReady={handleReady} style={{ width: '100%', height: '100%' }} />

        {busy && !error && (
          <Overlay>
            <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{ready ? 'Downloading once…' : 'Preparing viewer…'}</p>
          </Overlay>
        )}

        {error && (
          <Overlay>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <div className="flex gap-2">
              {errorGuide && (
                <Button size="sm" variant="outline" onClick={() => void openGuide(errorGuide)}>
                  Retry
                </Button>
              )}
              {errorGuide && (
                <Button
                  size="sm"
                  variant="ghost"
                  nativeButton={false}
                  render={<a href={errorGuide.url} target="_blank" rel="noopener noreferrer" />}
                >
                  Open in new tab
                  <IconExternalLink size={16} />
                </Button>
              )}
            </div>
          </Overlay>
        )}
      </section>
    </div>
  );
}

// Centered overlay on top of the viewer for loading / error states.
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background p-4 text-center"
    >
      {children}
    </div>
  );
}
