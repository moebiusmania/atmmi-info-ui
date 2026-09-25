# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

Unofficial dashboard for ATM Milano transit info (metro status, surface alerts, traffic, news),
built as a single **Fresh 2** app on **Deno 2** with Preact and Vite 7. Deployed on Deno Deploy. UI
copy is Italian (`<html lang="it-IT">`).

## Commands

```sh
deno install          # required after clone / dependency changes (nodeModulesDir: "manual")
deno task dev         # Vite dev server on http://localhost:3000 (set in vite.config.ts)
deno task dev:host    # same, also exposed on the local network (vite --host)
deno task build       # production bundle into _fresh/
deno task start       # serve _fresh/server.js
deno task check       # deno fmt --check . && deno lint . && deno check <entrypoints>
deno task test        # deno test -A
deno test -A lib/__tests__/parser_test.ts             # single file
deno test -A --filter "parseNews" lib/__tests__/      # single test by name
deno fmt              # fix formatting (tabs, line width 100)
```

CI (`.github/workflows/`): push to `main` runs install → check → test; PRs additionally run
`deno task build`. `deno task check` type-checks an explicit glob list — if you add a new top-level
directory of TS files, add it to the `check` task in `deno.json`.

## Architecture

**Request flow.** `main.ts` wires `staticFiles()` + `app.fsRoutes()`. The home page
(`routes/index.tsx`) is fully server-rendered: it awaits `loadDashboardData()`
(`lib/dashboard_data.ts`), which runs all upstream fetches via `Promise.allSettled` and returns a
`DashboardData` object with a `value | null` and an `error | null` field per section. Components
under `components/` render either the data or the error message per section — one failing upstream
must not break the page. The only client-side interactivity is `islands/ThemeSwitcher.tsx` (sets
`html[data-theme]`, persisted in `localStorage`).

**Data layer (`lib/data/*.ts`).** One module per upstream source; each exports a `get*()` function
that is shared by the dashboard loader and by the matching JSON endpoint in `routes/api/` (API
handlers are thin wrappers: `define.handlers({ GET() { return Response.json(await getX()) } })`).
`status_v2.ts` (giromilano JSON API) backs `/api/status` but is not currently shown on the
dashboard; the dashboard uses the scraped `status_v1.ts`.

**Upstream HTTP.** `lib/atm_fetch.ts` exposes `getPage()` (ATM homepage HTML) and `getApi(resource)`
(giromilano JSON). Both use a `Deno.createHttpClient({ tlsOptions: { insecure: true } })` client
because of legacy upstream certificates — keep this permissive client scoped to these hosts only.
`surface.ts` (`alert.atm.it`), `weather.ts` (Open-Meteo, no key) and `air.ts` (ARPA Lombardia via
the dati.lombardia.it Socrata API) use plain `fetch`. `air.ts` hardcodes the Milan ARPA sensor IDs
and averages them per pollutant; NO₂/O₃ are hourly, PM10/PM2.5 are previous-day daily averages.

**HTML scraping.** Upstream HTML is parsed server-side with `happy-dom` (`new Window()`, then
`document.write(html)` or `body.innerHTML = ...`). Selector helpers live in `lib/parser.ts`; they
depend on ATM's markup (e.g. `.StatusLinee_StatoScritta`), so upstream site changes break them.

**PWA & static files.** `static/` is served at the site root: `manifest.webmanifest`, `sw.js`
(network-first for pages with offline fallback, cache-first for `/assets/` and icons) and the icons.
`routes/_app.tsx` registers the service worker only when `import.meta.env.PROD`, so it never runs
under `deno task dev`. The PNG icons are rendered from `favicon.svg`; the header uses `logo.svg`
(same tile without the orange frame) — regenerate the PNGs if you change either.

**Tests.** `lib/__tests__/` uses a local `assert.ts` instead of `jsr:@std/assert` (so tests run
offline) — import assertions from there. DOM tests use a `domTest` helper that disables Deno's
op/resource sanitizers for happy-dom.

## Conventions

- Import via the `@/` alias (maps to repo root), e.g. `@/lib/parser.ts`.
- Route/page/handler definitions use `define` from `utils.ts` (`createDefine<State>()`).
- TSX files that render JSX start with `import "preact/jsx-runtime";` so `deno check` resolves the
  `jsx: "precompile"` output.
- Styling is vanilla CSS in `assets/styles.css` (imported from `client.ts`): design tokens as
  `:root` custom properties, dark theme overrides under `html[data-theme="dark"]`, CSS nesting. No
  Tailwind/utility framework.
- Dashboard layout is a CSS grid with named areas per breakpoint (`.dashboard__grid`, 1/2/3
  columns); each `Card` gets `card--<id>` for its area. Load animations are staggered through the
  `--i` (card/tile index, set by `Card`'s `index` prop) and `--j` (row index) custom properties; a
  `prefers-reduced-motion` block at the end of `styles.css` disables all motion.
- No root `tsconfig.json`; TS settings live in `deno.json`. Don't add one.
- Shared types: `types/line.ts` (`ScrapedLineStatus`, `MetroLineStatusV2`), `types/news.ts`.
