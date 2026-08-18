# AGENTS.md

Compact reference for agents working in this repo. For full architecture docs, see `CLAUDE.md`.

## Setup

- **Node 22** (`.nvmrc`), **pnpm 11.9.0** (`packageManager` in `package.json`)
- `pnpm install` then `pnpm dev` (copies pdfium wasm, starts Turbopack dev server via `portless`)

## Commands

```bash
pnpm check          # lint + format + safe fixes (Biome) — run before committing
pnpm typecheck      # tsc --noEmit — MUST pass; CI blocks on this
pnpm lint:ci        # CI lint (no writes); currently continue-on-error in CI (pre-existing debt)
pnpm knip           # dead-code check; also continue-on-error in CI
pnpm test           # vitest run (unit + component + storybook tests)
```

## CI gate (must pass)

1. `pnpm typecheck` — **hard gate**, no exceptions
2. `pnpm lint:ci` and `pnpm knip` — run but currently soft (continue-on-error)
3. Tests are currently disabled in CI (Storybook browser tests not yet supported there)

## Critical gotchas

- **Machine-coding `readFileSync` gotcha**: when adding a new problem, you MUST extend `outputFileTracingIncludes` in `next.config.ts` or the page 500s in production (works locally).
- **Biome excludes**: `src/views/**/*.jsx`, `src/views/**/solution-*.js`, `src/views/machine-coding/*/TsxVersion.tsx`, and `src/components/ui/**` are excluded from linting. Don't try to fix formatting in those files.
- **Dexie schema changes**: add tables to the existing `version(1).stores({...})` in `src/db/index.ts`. Don't create new Dexie instances.
- **Content bookmarkable/reviewable**: any new content type must get a case added in `src/lib/resolve-content.ts`.
- **No em dashes (`—`)** anywhere in article text or content.
- **Dark-mode only** — no theme toggle exists.
- **Two UI systems coexist**: shadcn/ui + Tailwind v4 for most surfaces; `@leafygreen-ui/*` for MongoDB-styled components. Check which a surface uses before adding a third.
- **Code inspector** (`code-inspector-plugin`, dev-only, wired in `next.config.ts`): click-to-source opens VS Code via its local server on **fixed port 5678** (independent of the app's random portless port). The client hardcodes `http://localhost:5678/?file=...`, so if you touch the CSP `connect-src` in `next.config.ts`, keep `http://localhost:5678` in it (dev-only) or the click XHR gets blocked. Works from `https://quickrecall.localhost` too (localhost is a potentially-trustworthy origin, so no mixed-content block). The switch button renders inside the plugin's shadow DOM (`code-inspector-component`); default hotkey is Windows `Alt+Shift`. `node-pty` (optional dep of `@code-inspector/core`) is skipped via `strictDepBuilds: false` in `pnpm-workspace.yaml` — don't add it back to `allowBuilds`.

## Style

Biome enforces: single quotes (JS/TS), double quotes (JSX), 140 line width, 2-space indent, no trailing commas, semicolons, `arrowParentheses: always`.

## Test structure

- Unit tests: `src/**/*.test.ts` (node environment)
- Component tests: `src/**/*.test.tsx` (jsdom, with `vitest.setup.ts`)
- Storybook tests: `*.stories.tsx` files run via `@storybook/addon-vitest` with Playwright browser (locally only, not in CI)
