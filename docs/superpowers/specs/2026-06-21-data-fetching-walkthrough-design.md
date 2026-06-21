# Data Fetching Walkthrough — TanStack Query vs RTK Query

**Date:** 2026-06-21
**Status:** Approved design — ready for implementation plan

## Context

QuickRecall teaches interview-prep concepts. The user wants an educational, **live** comparison of TanStack Query vs RTK Query against the dummyjson quotes API (`https://dummyjson.com/quotes`), with a **pill toggle** that swaps the whole page between the two libraries and a **walkthrough** view (live demo + annotated implementation file).

This is the first of a planned **series** of library walkthroughs (Redux Toolkit vs Zustand to follow). So the feature is built as a **reusable shell** plus per-topic content, under a new top-level **"Deep Dives"** sidebar section — not a one-off page.

Intended outcome: a self-contained `/deep-dives/data-fetching` page where the user can toggle between two real, working data-fetching implementations and read an annotated walkthrough of each.

## Decisions (locked)

- **Live runnable demo** — both libraries make real network calls (not static snippets).
- **Whole page swaps** on toggle — one library shown at a time, fully.
- **Walkthrough = live demo on top + annotated single implementation file below.**
- **Placement:** new top-level **"Deep Dives"** sidebar group; route `/deep-dives/data-fetching`. Built to host future comparisons.
- **Demo behavior:** paginated quote list (`?limit&skip`, Prev/Next).
- **Isolation:** page-scoped providers — a **page-local Redux store** (with `quotesApi` reducer + middleware) and a **page-local `QueryClientProvider`**. The global store in `src/store/index.ts` is **not** modified. This sidesteps the fact that RTK Query middleware cannot be injected at runtime (the store uses dynamic reducer injection, but middleware is fixed at `configureStore` time).
- **Transport:** **both** variants use **axios** (already installed, `^1.18.0`) under the hood. TanStack's `queryFn` calls axios. RTK Query uses a **custom `axiosBaseQuery`** (not `fetchBaseQuery`, which uses native `fetch`) so the comparison is apples-to-apples on the network layer and only the library wrapper differs.

## Architecture

### Reusable shell — `src/ui-component/deep-dive/`

- **`WalkthroughLayout.tsx`** — Renders the pill toggle (reuse existing `segmentedControlSx` from `src/ui-component/machine-coding/segmentedControlSx.ts` + MUI `ToggleButtonGroup`, matching the problem pages). Takes an array of "variants"; the active variant's live demo and annotated file fill the body. Also renders a single shared comparison strip (rendered once, not per variant).
- **`AnnotatedFile.tsx`** — Wraps the existing `CodeViewer` (`src/ui-component/machine-coding/CodeViewer.tsx`) and renders explanation callouts keyed to line ranges of the displayed source.

A variant provides: `label`, `demo` (ReactNode), `code` (string), `filename`, `annotations` (line-range → explanation text).

### Feature content — `src/views/deep-dives/DataFetching/`

```
index.tsx            # 'use client' — composes WalkthroughLayout with the two variants + comparison strip
DemoProviders.tsx    # page-local Redux <Provider> (page store) + <QueryClientProvider>
tanstack/
  quotes.api.ts      # axios instance + fetchQuotes(page) + response types for dummyjson quotes
  QuotesDemo.tsx     # live paginated list via useQuery + keepPreviousData
  impl.source.ts     # annotated code string + annotations array
rtk/
  axiosBaseQuery.ts  # custom axios-backed baseQuery for RTK Query (replaces fetchBaseQuery)
  quotesApi.ts       # createApi/quotesApi (reducerPath, axiosBaseQuery, getQuotes endpoint) — exports reducer + middleware + useGetQuotesQuery
  QuotesDemo.tsx     # live paginated list via useGetQuotesQuery
  impl.source.ts     # annotated code string + annotations array
```

### Route & menu

- **Route:** `src/app/(dashboard)/deep-dives/data-fetching/page.tsx` — renders `DataFetching` view.
- **Menu:** new `src/menu-items/deep-dives.tsx` (`NavItemType` group, id `deep-dives`, child item → `/deep-dives/data-fetching`). Register it in `src/menu-items/index.tsx` `items` array.

## Data Flow

Shared endpoint: `GET https://dummyjson.com/quotes?limit={L}&skip={S}` → `{ quotes: [{ id, quote, author }], total, skip, limit }`. Both demos use `limit = 6`; Prev/Next adjust `skip`.

**TanStack variant:** `useQuery({ queryKey: ['quotes', page], queryFn: () => fetchQuotes(page), placeholderData: keepPreviousData })` where `fetchQuotes` calls **axios**. Annotations teach: `queryKey` as cache identity, `isPending` vs `isFetching`, `keepPreviousData` (list stays visible while next page loads), `staleTime`, automatic dedup/caching. `QueryClient` comes from the page-local `QueryClientProvider`.

**RTK Query variant:** `createApi({ reducerPath: 'quotesApi', baseQuery: axiosBaseQuery({ baseUrl: 'https://dummyjson.com' }), endpoints: (builder) => ({ getQuotes: builder.query<...,{ limit; skip }>(...) }) })` — uses a **custom axios baseQuery** (returns `{ data }` / `{ error }`), not `fetchBaseQuery`. Component uses `useGetQuotesQuery({ limit, skip })`. Reducer + middleware wired into the **page-local** store in `DemoProviders.tsx`. Annotations mirror the same concepts (custom axios baseQuery, cache location via `reducerPath`, auto-generated hook naming, `isLoading` vs `isFetching`, per-arg cache entries, and the **required-middleware gotcha** — consistent with `src/data/redux/rtk-query-notes.ts`).

**Shared UX:** both variants render the same loading skeleton (first load), a subtle "refetching" indicator on page change, and an error state with retry — so the only visible difference is the code, not the chrome.

**Comparison strip:** one shared summary listing trade-offs — standalone vs Redux-integrated; manual `useQuery` vs auto-generated hooks; query-key invalidation vs cache-tag invalidation; cache location (QueryClient vs Redux state).

## Displayed source vs real source

Because the page must be a **client** component with live providers, it cannot use the server-component `readFileSync` pattern used by the machine-coding problems. The annotated code is therefore kept as a colocated `impl.source.ts` **string** next to the real `QuotesDemo.tsx`. This duplicates the real implementation for teaching purposes — acceptable for an educational artifact. (Alternative, if single-sourcing is preferred later: read the sibling `.tsx` raw text at build time in the route's server boundary and pass it down as a prop. Not done in v1 to keep the page self-contained.)

## Dependencies

- Add **`@tanstack/react-query`**.
- RTK Query ships inside the already-installed `@reduxjs/toolkit` (2.7.0) — no new dep.

## Verification

1. `npm run dev`, visit `/deep-dives/data-fetching`.
2. Toggle the pill: both TanStack and RTK Query variants load **real** quotes from dummyjson.
3. Prev/Next paginate; transitions are smooth (no blank flash — `keepPreviousData` / RTK cached data).
4. Simulate offline → error state with retry renders for both.
5. Annotations render against the correct code line ranges.
6. Confirm the **global** Redux store is untouched — Redux DevTools shows no `quotesApi` branch when on other pages (it exists only within the page-local store).
7. `npm run lint` and `npm run build` complete clean.

## Out of scope (YAGNI)

- Mutations / cache invalidation demo (quotes API is read-only).
- List + detail or random-quote views (paginated list chosen).
- Wiring RTK Query into the global store or a dynamic-middleware enhancer.
- The future Redux Toolkit vs Zustand walkthrough (separate spec; this only builds the reusable shell it will use).
