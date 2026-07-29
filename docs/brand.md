# QuickRecall brand

QuickRecall borrows MongoDB's **LeafyGreen** design system and owns its **identity**. Those are
different layers, and keeping them separate is the whole strategy: LeafyGreen decides what a button
looks like, QuickRecall decides what the product *is*.

| Layer | Owner | Rule |
| --- | --- | --- |
| Surfaces, green scale, radii, component behaviour | LeafyGreen | Borrowed as-is. Don't fork it, don't re-tune the palette. |
| Mark, lockup, accent discipline, editorial voice, tagline | QuickRecall | Defined here. |

The identity is **additive** — nothing in `src/app/globals.css` changes to support it.

## The mark: "The Recall Loop"

A near-closed ring whose tail is one diagonal stroke breaking out through the gap. It reads as a
**Q** at a glance, and as **a loop with an exit** on the second read: the spaced-repetition cycle,
and the moment the answer comes back.

Geometry lives in [`src/components/brand/mark-paths.ts`](../src/components/brand/mark-paths.ts) and
is the single source of truth. Three renderers consume it — the in-app `<Logo>`, the OG image, and
`scripts/icon-source.html` — so the mark can't drift between the app, the favicon and social cards.

**Rules**

- Ring in `currentColor`, tail in `#00ed64`. Never both green — that collapses the two-tone into a blob.
- **The tail must cross the bowl.** This is the one non-negotiable. A tail that only touches the
  ring and points outward is a magnifying-glass handle, and the first version of this mark read as
  a search icon at every size because of it. The tail runs from well inside the ring to well
  outside; shorten either end and it reverts to a magnifier.
- Apart from the tail, the bowl stays empty. No inner glyph, no fill.
- Never below 16px. Below that the crossing stops resolving and it degrades into a circle with a dot.
- Clear space on all sides: one ring-radius (7.5 units of the 24-unit grid).

**Rendering it:** always `<Logo>` from [`src/components/brand/logo.tsx`](../src/components/brand/logo.tsx).
Don't re-inline the SVG, and don't wrap `<Logo>` in `text-primary`.

## Lockup

Mark + `QuickRecall` in **Lora SemiBold**, gap of 2 (`gap-2`), optically centred.

Lora is the strongest non-LeafyGreen signal available — LeafyGreen ships no serif, so the wordmark
is instantly not-MongoDB while every surface around it stays consistent with the system.

## Accent discipline

`#00ed64` marks **retrieval and progress only**: the mark's tail, review grades, streaks, the primary
action on a page. It is never decoration, never a background wash, never a second heading colour.

That restraint is what separates QuickRecall from a generic green dashboard. Green means *you
recalled something*. If it starts appearing on inert surfaces, it stops meaning anything.

`#71f6ba` is the supporting mint. `#0498ec` / `#ffc010` / `#ff6960` are **signals only** (info,
warning, error) and carry no brand meaning.

## Voice

Precise, calm, fast, engineer-native. Not edu-cute, not bootcamp-loud.

Tagline: **"Answer, then know why."** — retrieval before explanation, which is what
[`src/lib/review-scheduler.ts`](../src/lib/review-scheduler.ts) already enforces.

Per the content style rules in `CLAUDE.md`, never use an em dash in brand or content copy.

## Never

Graduation caps, brains, lightbulbs, owls, flashcard clipart, and **any leaf**. The app shipped
MongoDB's leaf as its own icon for a while; that's the exact mistake this document exists to prevent.

## Regenerating the icon set

The repo has no image toolchain on purpose (no `sharp`, no new dependency for three PNGs). After
changing the geometry in `mark-paths.ts`:

1. Mirror the two path strings into `src/app/icon.svg` and `scripts/icon-source.html`.
2. Serve `scripts/icon-source.html` over http (`file:` is blocked in headless Chrome).
3. Screenshot it at an exact viewport for each target: `?size=192`, `?size=512`, and
   `?size=512&maskable=1`, into `public/icons/`; plus `?size=48` hand-packed into `public/favicon.ico`.

`src/app/icon.svg` is the real favicon and covers every modern browser. `public/favicon.ico` exists
only because browsers probe `/favicon.ico` unprompted; it lives in `public/` rather than `src/app/`
deliberately, since files there are served verbatim — Turbopack's metadata pipeline rejects an ICO
whose embedded PNG isn't RGBA, which is exactly what a headless-Chrome screenshot produces.
