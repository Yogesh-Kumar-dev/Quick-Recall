# Dynamic Reducer Injection (Redux Code-Splitting)

## What this is

Feature Redux slices are **not** statically combined into the root reducer.
Instead, each slice is **injected into the store at runtime** the first time a
route that needs it renders. Only `snackbar` is wired statically.

This is the [official Redux "reducer manager" pattern](https://redux.js.org/usage/code-splitting),
adapted for RTK 2 + Next.js App Router.

## Why

`src/data/` holds large static content arrays (notes, flashcards, problems) for
JS, React, Redux, Next.js, HTML/CSS, and Engineering. Each slice imports its
data and bakes it into `initialState`. If all slices were statically combined in
`store/reducer.ts`, **every page** would download + parse + execute **all** of
that data, because the root store module is loaded at the app root.

By injecting on demand, a slice's reducer (and the data it imports) ships in the
**consuming route's chunk**, not the shared bundle — so the data's code only
loads when the user actually opens that section.

## The data flow

```
BUILD TIME
  src/data/<feature>/*.ts   ──bundled──►   <feature> route chunk
                                            (NOT the shared/root bundle)

RUNTIME — user navigates to /react/notes
  1. Browser downloads react route chunk            (network)
  2. Chunk module EXECUTES:
       import { reactNotes } from 'data/react'       → array constructed on JS HEAP
       const initialState = { reactNotes, ... }      → references that heap object
  3. useInjectReducer('react', reactReducer)         → manager.add() rebuilds combineReducers
                                                         (registers the reducer; does NOT dispatch)
  4. useSelector(selectReactNotes)                   → first render: state.react is still undefined,
                                                         so the slice's root selector returns
                                                         initialState (the ?? fallback). No undefined,
                                                         no crash, no render-phase dispatch.
  5. Next natural dispatch (any action)              → combineReducers runs the react reducer,
                                                         store.getState().react now POINTS to the
                                                         same heap object; the fallback is bypassed.
```

### Why no dispatch on injection (important)

Injection deliberately **does not dispatch**. An earlier version fired a no-op
`@@inject/<key>` action to materialise `initialState` immediately — but
dispatching **during render** notifies store subscribers (e.g. the in-app
DockMonitor) mid-render, which React forbids:

> Cannot update a component (`Connect(DockMonitor)`) while rendering a different
> component (`HtmlNotesPage`).

This is the official RTK `combineSlices().inject()` model: **registering a
reducer does not dispatch**, so the injected branch stays `undefined` until the
next natural dispatch. To keep selectors safe in that window, each slice's root
selector falls back to `initialState`:

```ts
type State = { react?: ReactState };               // branch is optional
const selectReactState = (s: State) => s.react ?? initialState;
```

That mirrors RTK's `.selector()` Proxy, which returns `initialState` for an
undefined injected branch. Net effect: no render-phase dispatch, no `undefined`
flash, no React warning.

### Key mental model

- A **chunk is a delivery mechanism (a file)**, not a storage location. Once it
  executes, what persists is the **JS object on the heap** it created.
- Redux state does **not copy** the data — it holds a **reference** to the same
  array the data module produced. One object, two references (the module + the
  store). That's why injection is cheap.
- Because the data is **static** (a plain import), `initialState` is fully built
  the moment the module executes — so the `?? initialState` fallback serves the
  real data even before any dispatch populates the store branch. There is **no
  loading state** today. (With a future DB/API source, `initialState` becomes the
  empty/loading shape and that same fallback serves *that* during load — see the
  DB migration section.)

## Files

| File | Role |
|------|------|
| `store/reducerManager.ts` | The manager: `add` / `remove` / `reduce`, rebuilds `combineReducers` on change. |
| `store/useInjectReducer.ts` | Hook called by consuming views. **Registers** the reducer once (in a `useState` initializer), before the component's selectors. Does **not** dispatch — see "Why no dispatch on injection" above. |
| `store/slices/*.ts` | Each feature slice's root selector falls back to `initialState` (`s.<key> ?? initialState`) so selectors are safe before the branch is populated. |
| `store/reducer.ts` | Static reducers only (`snackbar`) + creates the manager. |
| `store/injectable.ts` | **Type-only** composition of every feature slice's state shape → `InjectableState`. Erased at compile time, so it does NOT couple data into the bundle; it just keeps `RootState`/selectors type-safe. |
| `store/index.ts` | `RootState = StaticState & InjectableState`; attaches `reducerManager` to the store. |

## How to add / wire a feature slice

In the consuming `'use client'` view, **before any selector**:

```ts
import useInjectReducer from 'store/useInjectReducer';
import reactReducer, { selectReactNotes } from 'store/slices/react';

export default function ReactNotesPage() {
  useInjectReducer('react', reactReducer);     // ← must be first, before useSelector
  const reactNotes = useSelector(selectReactNotes);
  // ...
}
```

When adding a **new** slice, two extra steps:

1. Add its state type to `InjectableState` in `store/injectable.ts`.
2. Make its **root selector fall back to `initialState`** (so it's safe before
   the branch is populated by a dispatch):

   ```ts
   type State = { myFeature?: MyFeatureState };          // optional branch
   const selectMyFeatureState = (s: State) => s.myFeature ?? initialState;
   ```

## Why the same `useInjectReducer(key, reducer)` appears in many views — and why that's safe

The same call (e.g. `useInjectReducer('redux', reduxReducer)`) is duplicated
across **every view that reads that slice** — all four redux views, both
html-css views, etc. This is **necessary, not redundant**: each view is an
independent route entry point. A user can deep-link straight to
`/redux/rtk-query` without ever visiting `/redux/notes`, so every consumer must
*independently* guarantee its slice is present. You can't assume a sibling route
already injected it.

It does **not** cause a slice to load twice, because registration is **keyed and
idempotent**, protected by two independent guards:

| Guard | Where | Scope | Prevents |
|-------|-------|-------|----------|
| `useRef(false)` → `if (!injected.current)` | `useInjectReducer` (per component instance) | per-component, across re-renders | re-running the inject logic on every render of the *same* mounted component |
| `if (reducers[key]) return` | `reducerManager.add` (the store singleton) | global, across all components | re-registering a slice that *any* component already injected |

The decisive one is the manager's `add`:

```ts
add: (key, reducer) => {
  if (!key || reducers[key]) return; // already injected — keep idempotent
  reducers[key] = reducer;
  combinedReducer = combineReducers(reducers);
}
```

- **First call** for a key: `reducers[key]` is `undefined` (falsy) → registers
  the reducer and rebuilds `combineReducers`.
- **Every later call** (any other view, re-render, re-navigation): `reducers[key]`
  is truthy → early `return`. No re-registration, no `combineReducers` rebuild.

So the *call* happens many times, but the *registration* happens **exactly once
per key**. `useInjectReducer` also computes `added` (`!getReducerMap()[key]`)
before calling `add`, so the one-off no-op dispatch fires **only** on the genuine
first injection — no spurious dispatches on repeat visits.

**The deeper reason:** reducers live in a **keyed map** (`Record<string, Reducer>`),
not a list. `combineReducers({ redux, react, … })` produces one reducer per key,
so a key maps to exactly one slice — set semantics, not array semantics. Even
without the guard the worst case is *overwriting* `'redux'` with an identical
reducer (harmless); the guard just makes it a clean early-return and skips the
needless rebuild.

### Walkthrough: navigate `/redux/notes` → `/redux/rtk-query`

1. `/redux/notes` mounts → `useInjectReducer('redux', …)`:
   `injected.current` false → `reducers['redux']` undefined → `added = true` →
   `add()` registers + rebuilds → dispatch `@@inject/redux` → `initialState` lands.
2. `/redux/rtk-query` mounts (a **new** component instance) → `useInjectReducer('redux', …)`:
   `injected.current` false (fresh instance) → but `reducers['redux']` already set →
   `added = false` → `add()` hits `if (reducers[key]) return` (no-op) → **no dispatch**.
   The existing slice (data already on the heap) is reused; the store doesn't change.

### Subtlety worth remembering for debugging

The guard compares by **key string**, not by reducer identity. If two files ever
injected *different* reducers under the same key, the first wins and the second
is silently ignored. That can't happen here (every `useInjectReducer('redux', …)`
imports the same `reduxReducer` default), which is exactly why the convention
**one key ↔ one slice module** matters. Symptom of violating it: "my second
slice's state never appears" — and this guard would be the cause.

## Caveats / things to know

- **`remove()` is intentionally unused.** Our slices hold static reference data,
  so once injected we keep them resident. Ejecting on unmount would just rebuild
  identical `initialState` on the next visit. The eject machinery is kept ready
  for slices that *should* be torn down (per-session/entity state, micro-frontends).
- **`RootState` types all feature slices as always-present** (the decoupling that
  keeps selectors type-safe). TS will therefore NOT catch a page reading a slice
  it didn't inject. At runtime that branch is `undefined` until a dispatch, but
  the per-slice `?? initialState` fallback makes the read return `initialState`
  rather than crash. Each consuming page injects its own slice, so this is fine
  today; remember it when adding cross-slice reads.
- **Injection never dispatches.** Registration is idempotent at the manager level
  (`if (reducers[key]) return`) and runs once per component via the `useState`
  initializer, so the no-dispatch design holds regardless of re-renders.
  `reactStrictMode: false` (next.config.ts) also means no double-invoked renders.

## Future: moving static data to a DB + API

The injection scaffolding stays identical. Only the **data source inside each
slice** changes:

- `initialState` becomes the empty / `loading` shape (e.g. `{ notes: [], loading: true }`).
- Data arrives **asynchronously** via a thunk or RTK Query instead of a static
  import.
- Add loading / error states; components must handle the empty/loading shape.

**The `?? initialState` fallback is forward-compatible — no change needed.** It
returns whatever `initialState` currently is. Today that's the full static data;
after migration it's the empty/loading shape, so the same fallback serves the
correct "not loaded yet" state during both the pre-injection window *and* the
in-flight API window. (Trade-off to keep in mind: the fallback can *mask* a
genuinely missing branch by returning empty data instead of erroring loudly —
the same trade-off RTK's `.selector()` Proxy makes, and considered acceptable.)

Today's bundle-split boundary (per-route chunk) cleanly becomes tomorrow's
API-fetch boundary — same seam, same per-feature isolation.
