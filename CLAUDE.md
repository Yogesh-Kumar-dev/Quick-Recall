# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QuickRecall** — A Next.js 15 interview preparation tool for JavaScript, TypeScript, and React. Features machine coding problems with side-by-side live output + code viewer, concept cards, and quick-recall cheat sheets.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # Biome lint on ./src
npm run lint:fix     # Biome lint with safe auto-fixes
npm run format       # Biome format all src files
npm run check        # Biome lint + format + safe fixes in one pass
npm run knip         # Find unused exports/dependencies
```

No test runner is configured.

## Architecture

### Route Groups (Next.js App Router)

- `src/app/(dashboard)/` — Main interview prep content; uses `MainLayout` (sidebar + header)
- `src/app/(minimal)/(auth)/` — Login/register pages; uses `MinimalLayout`
- `src/app/(simple)/` — Utility pages; uses `SimpleLayout`

Auth is **disabled in v1** — the `AuthGuard` wrapper is commented out in `src/app/(dashboard)/layout.tsx`. To re-enable auth, wrap `DashboardLayout` with `<AuthGuard>`.

### Provider Stack (ProviderWrapper)

`src/store/ProviderWrapper.tsx` wraps the app in this order: Redux `Provider` → `ConfigProvider` → `ThemeCustomization` → `Locales` → `NavigationScroll` → `AuthProvider` → `Notistack` → `Snackbar`.

**Active auth provider**: `JWTContext`. Alternatives (Firebase, Auth0, AWS Cognito, Supabase) exist in `src/contexts/` and can be swapped in `ProviderWrapper.tsx`.

### State Management

Redux Toolkit store (`src/store/`) with a single `snackbar` slice. `ConfigContext` (`src/contexts/ConfigContext.tsx`) manages theme settings (mode, direction, presetColor, etc.) — not stored in Redux. Use `useConfig()` hook to read/write config values.

### Theme System

`src/themes/` builds an MUI theme dynamically from `ConfigContext`. Palette presets, typography, shadows, and component overrides are composed in `src/themes/index.tsx`. MUI imports are tree-shaken via `modularizeImports` in `next.config.ts` — always import from the specific path (e.g., `import Button from '@mui/material/Button'`).

### Content Data

`src/data/` contains static TypeScript arrays for all content:
- `js-concepts.ts`, `react-concepts.ts`, `ts-concepts.ts` — concept cards
- `js-quick-recall.ts`, `react-quick-recall.ts` — cheat sheet sections
- `js-problems.ts`, `react-mc-problems.ts` — problem registries (metadata only, no code)

Types for all content shapes live in `src/types/content.ts`.

### Machine Coding Problems — React

Each problem lives in `src/views/machine-coding/<ProblemName>/` with four files:
- `index.tsx` — **Server Component** that reads source files via `readFileSync` at build time, defines `PROBLEM` metadata, and renders `<ProblemLayout>`
- `JsxVersion.jsx`, `TsxVersion.tsx`, `MuiVersion.tsx` — three live implementations

`ProblemLayout` (`src/ui-component/machine-coding/ProblemLayout.tsx`) splits the page into a resizable left panel (live output) and right panel (Monaco code viewer with version picker).

**To add a new React machine coding problem:**
1. Create `src/views/machine-coding/<Name>/` with `index.tsx`, `JsxVersion.jsx`, `TsxVersion.tsx`, `MuiVersion.tsx`
2. Add a route page at `src/app/(dashboard)/machine-coding/<slug>/page.tsx` that imports and renders the index
3. Add a nav entry in `src/menu-items/react.tsx`

### Machine Coding Problems — JS

Each problem lives in `src/views/js-machine-coding/<ProblemName>/` with:
- `index.tsx` — **Server Component** that reads `solution-*.js` files via `readFileSync`, defines `PROBLEM` metadata + `APPROACHES` array, renders `<JsProblemLayout>`
- `solution-*.js` files — raw JS solution files (brute, optimal, builtin, recursive, etc.)

Dynamic routing: `src/app/(dashboard)/js/machine-coding/[slug]/page.tsx` maintains a `PROBLEM_MAP` registry mapping slugs to lazy imports.

**To add a new JS machine coding problem:**
1. Add entry to `jsProblems` array in `src/data/js-problems.ts`
2. Create `src/views/js-machine-coding/<Name>/` with `index.tsx` + solution files
3. Register the slug in `PROBLEM_MAP` in `src/app/(dashboard)/js/machine-coding/[slug]/page.tsx`

### Navigation

`src/menu-items/index.tsx` composes the sidebar from `dashboard`, `javascript`, and `react` menu groups. Each group is a `NavItemType` tree rendered by `src/layout/MainLayout/MenuList/`.

## Code Style

Formatting and linting are handled by **Biome** (`biome.json`): single quotes, 140 line width, 2-space indent, no trailing commas, semicolons. Run `npm run check` (lint + format + safe fixes) before committing. The raw `solution-*.js` and `*.jsx` demo files under `src/views/**/machine-coding/` are excluded from Biome since they're displayed verbatim via `readFileSync`.

`reactStrictMode` is set to `false` in `next.config.ts` due to a known chart rendering issue.
