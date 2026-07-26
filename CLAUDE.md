# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QuickRecall** — a personal full-stack developer interview-prep knowledge base built with Next.js 16 (App Router, Turbopack, React 19). Covers JavaScript, TypeScript, React, Next.js, Redux, HTML/CSS, Node.js, databases (PostgreSQL, MongoDB, Redis, DynamoDB), and general engineering topics through notes, quick-recall cheat sheets, flashcards, and machine-coding problems with a side-by-side live demo + code viewer. Also includes a Job Tracker (kanban), a Speak Up rehearsal tool for behavioral/technical answers, bookmarks, and a spaced-repetition review queue — all persisted client-side. Ships as an installable, offline-capable PWA. There is no auth and no backend — everything runs and persists locally in the browser.

## Commands

```bash
pnpm dev             # copy pdfium wasm, then start dev server (Turbopack, via `portless`)
pnpm build           # copy pdfium wasm, then production build
pnpm start           # start production server
pnpm lint            # Biome lint on ./src
pnpm lint:ci         # Biome lint in CI mode (no writes)
pnpm format          # Biome format --write ./src
pnpm check           # Biome lint + format + safe fixes in one pass
pnpm typecheck       # tsc --noEmit
pnpm knip            # find unused exports/dependencies
```

No test suite exists yet — `pnpm test` is a no-op placeholder.

## Architecture

### App Router structure

All routed pages live under the single `src/app/(app)/` group, wrapped by `AppLayout` (shadcn `Sidebar` + `Tooltip` providers, `AppHeader`/`AppSidebar`). Topic sections: `js/`, `react/`, `nextjs/`, `redux/`, `html-css/`, `engineering/`; feature routes: `job-tracker/`, `speak-up/`, `bookmarks/`, `review/`, `flashcards/[section]/`, `dashboard/`, `about/`. `src/app/serwist/[path]/route.ts` and `src/app/~offline/` back the PWA service worker (see below).

### Client-side persistence — Dexie (IndexedDB), not localStorage

`src/db/index.ts` defines one Dexie database (`quickrecall`) with one table per feature: `jobs`, `speakUpQAs`, `bookmarks`, `reviews`. Each feature owns a repository module in `src/db/*.ts` (e.g. `src/db/jobs.ts`) — **components never touch the `db` object directly**; they go through the repository, and through a `use*` hook built on `dexie-react-hooks`'s `useLiveQuery` (e.g. `src/components/job-tracker/use-jobs.ts`, `src/components/speak-up/use-speak-up-qas.ts`). Live queries re-run automatically on any table mutation — including from another browser tab — so there's no manual state sync or optimistic patching; mutations just write.

When adding a new persisted feature, add a table to the single `version(1).stores({...})` schema (bump the version and add an `.upgrade()` if changing an existing table) rather than creating a new Dexie instance.

### Content data

`src/data/` holds static TypeScript content, organized by topic subfolder: `javascript/`, `react/`, `nextjs/`, `redux/`, `htmlcss/`, `engineering/` (each with `*-notes.ts`, `*-flashcards.ts`, `*-quick-recall.ts`, and problem-registry files). Shared shapes live in `src/types/content.ts` (`Note`, `Flashcard`, `QuickRecallSection`, `BaseProblemEntry`, `ProblemMeta`, etc.). `src/data/flashcards-index.ts` and `src/data/search-index.ts` aggregate across topics for cross-cutting features (flashcard lookup by key, global search).

`src/lib/resolve-content.ts` bridges the generic Bookmarks/Review features to this static content: a bookmark/review only stores a `kind` (`note` | `flashcard` | `problem`) plus a namespaced `refId`; `resolveContent()` looks that up against the merged `src/data` arrays and returns the real item plus its route. Any new content type that should be bookmarkable/reviewable needs a case added here.

### Spaced-repetition review

`src/lib/review-scheduler.ts` is a pure, framework-free SM-2-inspired scheduler (no Dexie/React/`Date.now()` inside — the caller passes `now`), retuned for short interview-prep timeframes: intervals start in minutes (Again 1m / Hard 10m / Good 1d / Easy 3d) and are capped around two weeks so nothing falls off the radar. `ReviewState` persists via the `reviews` Dexie table; the `/review` route consumes it.

### Machine Coding Problems

Both React and JS variants follow the same shape: a `src/views/{machine-coding,js-machine-coding}/<ProblemName>/index.tsx` **Server Component** that reads its sibling source file(s) via `readFileSync` at render time (so the raw, unminified source can be shown next to the live demo) and renders `ProblemShell` / `JsProblemShell` (`src/components/machine-coding/`).

- **React problems**: `JsxVersion.jsx` + `TsxVersion.tsx` siblings; registered in `PROBLEM_MAP` in `src/app/(app)/react/machine-coding/[slug]/page.tsx`, with metadata in `src/data/react/react-mc-problems.ts`.
- **JS problems**: one or more `solution-*.js` files (brute/optimal/builtin/recursive/...); registered in `PROBLEM_MAP` in `src/app/(app)/js/machine-coding/[slug]/page.tsx`, with metadata in `src/data/javascript/js-problems.ts`.

**Gotcha:** because `readFileSync` reads *raw, uncompiled* source files, Next's output file tracer doesn't pick them up automatically for serverless bundling. `outputFileTracingIncludes` in `next.config.ts` explicitly traces `src/views/**/*.{tsx,jsx,js}` into the relevant function bundles — forgetting to extend this when adding a new problem shape causes an ENOENT/500 in production despite working locally.

#### React machine-coding style guide (`JsxVersion.jsx` / `TsxVersion.tsx`)

These two files intentionally diverge in style so each teaches a different interview scenario — don't unify them.

- **`JsxVersion.jsx`**: both Tailwind `className` (active) and the equivalent inline `style={{...}}` object (commented directly above, as a reference for interview environments without Tailwind configured). Keep branching logic visible in multiple forms too (ternary commented out, `if/else` active, IIFE where it reads naturally) — the point is showing several ways to express the same thing.
- **`TsxVersion.tsx`**: Tailwind `className` only, no commented `style` blocks, no dead code. Every function (including inline handlers where it's not noisy) gets an explicit return type — this file is also the types-practice reference.
- **Sample data**: if a problem requires sample/seed data (a list to render, an API shape to consume, etc.), the problem statement/description must include it in detail — either the raw data inline or a URL to fetch it from. Don't leave the reader to invent their own shape.

Add further conventions to this list as they come up.

### Articles

Long-form, MongoDB-docs style walkthroughs — a standalone content type (`src/types/content.ts`'s `Article`/`ArticleBlock`), never a duplicate of an existing topic's notes/flashcards/quiz content. One file per article under `src/data/articles/`, aggregated in `src/data/articles-index.ts` (`ARTICLES`, `articleBySlug`, `articleById`, `resolveArticleRefs`). Routes: `src/app/(app)/articles/page.tsx` (index) and `src/app/(app)/articles/[slug]/page.tsx` (detail, `generateStaticParams` off `ARTICLES`). The detail page is the one route in the app with a 3-column layout — `src/components/content/article-view.tsx` adds a sticky right-rail "On this page" TOC (`article-toc.tsx`) local to that component, `AppLayout` itself is untouched.

#### Article content style guide

- **Blocks, not markdown.** `ArticleBlock` is a typed union (`heading` | `paragraph` | `code` | `callout` | `list` | `steps` | `filetree` | `table`) rendered via `article-blocks.tsx` using the app's existing `@leafygreen-ui/code`/`@leafygreen-ui/callout`/`@leafygreen-ui/table` — no MDX/markdown dependency.
- **Headings are real navigation**, not decoration — every `heading` block's `id` becomes a TOC anchor and must be unique within the article (hand-picked by the author, not auto-slugged from text).
- **`steps` vs `list`**: use `steps` for an ordered procedure where each item has its own explanation (MongoDB-docs "Procedure" style); use `list` for a flat set of related points with no inherent sequence.
- **`filetree`**: a VS Code Explorer–style folder/file tree (`article-file-tree.tsx`, custom — LeafyGreen has no tree/filesystem component). Prefer it over a code block for walking through a real directory structure (a build's output layout, a scaffolded template); use real, verified paths/filenames where possible rather than invented placeholders.
- **`table`**: LeafyGreen's `@leafygreen-ui/table`, used plainly (no `useLeafyGreenTable` — articles don't need sorting/pagination). Reach for it only when content is genuinely tabular (a comparison, a symbol/flag reference) — don't force a table where `list`/`steps` reads more naturally.
- **Code samples**: illustrative and as long as the concept needs — depth beats brevity here, `language` matches the existing `CodeLang` type (`jsx` | `tsx` | `javascript` | `typescript`) — don't invent a new language id per article (shell/JSON snippets use `javascript` or omit `language`, no bash/json lexer exists).
- **Cross-linking is manual and one-directional.** `articleRefs?: string[]` on `Note`/`Flashcard`/`QuizQuestion` points AT an article's `id`; articles never link back or duplicate what they point at. Add it only where a specific item genuinely benefits from the deeper read — do not blanket-link every item in a topic just because a related article exists.
- **Depth over brevity, always.** Assume the reader has never seen the topic before — build up from first principles, define jargon on first use, motivate *why* before *how*. Length is not a constraint; a long, thorough, engaging article beats a short summary. Reach for every block type where it adds real value (`callout` for gotchas/tips, `steps` for procedures, `table` for comparisons, `filetree` for real directory structures, extra headings for real TOC navigation) — visually rich and text-only-paragraphs are not the same thing.
- **Never use an em dash (`—`) anywhere in article text** (or anywhere else in this codebase's content) — rephrase with a period, comma, colon, parentheses, or a connecting word instead.

### PWA / offline support

The app builds with **Turbopack**, and `@serwist/next`'s webpack-based compilation doesn't support that — so the service worker is compiled via a Route Handler instead (`src/app/serwist/[path]/route.ts`, wired through `@serwist/turbopack`). `withSerwist(nextConfig)` in `next.config.ts` only adds `esbuild`/`esbuild-wasm` to `serverExternalPackages` so that route handler can bundle in the Node runtime. `SerwistProvider` (in `src/app/providers.tsx`) registers the worker at `/serwist/sw.js` and is disabled in dev — its install-time warm-up would otherwise trigger a Turbopack recompile per route on every "download for offline" run. Offline content selection/caching lives in `src/utils/offline-cache.ts` and `src/utils/pdf-cache.ts`, driven by `src/data/offline-content.ts` and the `useOfflineDownload` hook.

### Providers & UI stack

`src/app/providers.tsx` composes, outside-in: `SerwistProvider` → `NuqsAdapter` (URL state, e.g. notes/flashcard filters) → `EmotionRegistry` (flushes LeafyGreen's Emotion styles into the streamed SSR HTML via `useServerInsertedHTML` — without it, LeafyGreen markup ships classNames with no styles) → `LeafyGreenProvider darkMode` → `NotificationProvider` (`src/notifications/`, a manager/policy/prefs/registry split wrapping native Web Notifications with a `sonner` toast fallback) → `Toaster`.

The app is **dark-mode only** (forced `dark` class on the root `<html>`, MongoDB-style design) — there's no theme toggle or `next-themes`. Two UI systems intentionally coexist: shadcn/ui + Tailwind v4 (`src/components/ui/`) for most of the app, and `@leafygreen-ui/*` for a handful of MongoDB-styled components (callout, code, expandable-card). Check which pattern a given surface already uses before introducing a third.

### Search & navigation

Global search (`src/components/search/header-search.tsx`) is a `cmdk` command palette over `fuse.js`, indexed from `src/data/search-index.ts`. Sidebar navigation is a flat config in `src/config/nav.ts` (not a component tree), rendered by `src/components/layout/app-sidebar.tsx`.

## Code Style

Biome (`biome.json`): single quotes in JS/TS, double quotes in JSX, 140 line width, 2-space indent, no trailing commas, semicolons, `arrowParentheses: always`. Run `pnpm check` before committing. Raw machine-coding demo/solution files (`src/views/**/*.jsx`, `src/views/**/solution-*.js`, `src/views/machine-coding/*/TsxVersion.tsx`) and `src/components/ui/**` (shadcn-generated) are excluded from Biome since they're either displayed verbatim or vendored.
