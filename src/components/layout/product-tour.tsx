'use client';

import { GuideCue } from '@leafygreen-ui/guide-cue';
import { useQueryState } from 'nuqs';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { TOUR_STEPS } from '@/data/product-tour';
import useLocalStorage from '@/hooks/useLocalStorage';

const TOUR_SEEN_KEY = 'quickrecall-tour-seen';

// Mounted once in the (app) layout. Spotlights sidebar nav items on the Dashboard route —
// see docs/superpowers/specs/2026-07-24-product-tour-design.md for the full design.
export function ProductTour() {
  const pathname = usePathname();
  const router = useRouter();
  const [tourParam, setTourParam] = useQueryState('tour');
  const [seen, setSeen] = useLocalStorage(TOUR_SEEN_KEY, false);
  const { isMobile, open, setOpen, openMobile, setOpenMobile } = useSidebar();

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);
  const priorSidebarOpen = useRef<boolean | null>(null);

  const start = useCallback(() => {
    priorSidebarOpen.current = isMobile ? openMobile : open;
    if (isMobile) setOpenMobile(true);
    else setOpen(true);
    setStepIndex(0);
    setActive(true);
  }, [isMobile, openMobile, open, setOpenMobile, setOpen]);

  const finish = useCallback(() => {
    setActive(false);
    setTargetNode(null);
    setSeen(true);
    if (priorSidebarOpen.current !== null) {
      if (isMobile) setOpenMobile(priorSidebarOpen.current);
      else setOpen(priorSidebarOpen.current);
      priorSidebarOpen.current = null;
    }
  }, [isMobile, setOpenMobile, setOpen, setSeen]);

  // Auto-start on first visit to the Dashboard.
  useEffect(() => {
    if (pathname !== '/dashboard' || seen || active) return;
    const timer = setTimeout(start, 600);
    return () => clearTimeout(timer);
  }, [pathname, seen, active, start]);

  // Manual replay via the header button, which sets ?tour=1.
  useEffect(() => {
    if (tourParam !== '1') return;
    if (pathname !== '/dashboard') {
      router.push('/dashboard?tour=1');
      return;
    }
    start();
    void setTourParam(null);
  }, [tourParam, pathname, router, start, setTourParam]);

  // Locate the target nav item for the current step; skip defensively if it's missing.
  useEffect(() => {
    if (!active) return;
    const step = TOUR_STEPS[stepIndex];
    const node = document.querySelector<HTMLElement>(`[data-tour="${step.key}"]`);
    if (!node) {
      if (stepIndex < TOUR_STEPS.length - 1) setStepIndex((i) => i + 1);
      else finish();
      return;
    }
    // Scroll instantly (no smooth animation) so the tooltip's position calc, done at mount,
    // isn't racing an in-progress scroll for nav items nested deep in a collapsible section.
    node.scrollIntoView({ block: 'center', behavior: 'instant' });
    setTargetNode(node);
  }, [active, stepIndex, finish]);

  if (!active || !targetNode) return null;

  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const refEl = { current: targetNode };

  return (
    <GuideCue
      key={step.key}
      open={active}
      setOpen={() => {
        // no-op: visibility is driven by `active`, not GuideCue's internal step-transition close/reopen.
        // Real end-of-tour signals come from onDismiss (X/Esc) and onPrimaryButtonClick (last step).
      }}
      refEl={refEl}
      numberOfSteps={TOUR_STEPS.length}
      currentStep={stepIndex + 1}
      title={step.title}
      onDismiss={finish}
      onPrimaryButtonClick={() => {
        if (isLast) finish();
        else setStepIndex((i) => i + 1);
      }}
    >
      {step.description}
    </GuideCue>
  );
}
