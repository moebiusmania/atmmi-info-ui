# AGENTS.md — atmmi-info-ui

Single Fresh 2 app on **Deno** (not a monorepo). Dashboard for ATM Milano transit info.

## Commands

| Command           | Action                                                                          |
| ----------------- | ------------------------------------------------------------------------------- |
| `deno task dev`   | Vite dev server (URL in terminal; often port 5173)                              |
| `deno task build` | Production client + server bundle (`vite build`)                                |
| `deno task start` | Serve `_fresh/server.js` via `deno serve`                                       |
| `deno task check` | `deno fmt --check`, `deno lint`, `deno check` on entrypoints                    |
| `deno task test`  | `deno test -A` (parser + utils tests)                                           |
| `deno install`    | Populate `node_modules` for npm-specified packages (Preact, Vite plugins, etc.) |

CI: `deno install` → `deno task check` → `deno task test` (no production build in CI).

## Framework & toolchain

- **Fresh 2** (`jsr:@fresh/core`) with `main.ts` + `app.fsRoutes()`, Preact JSX,
  `@fresh/plugin-vite` + **Vite 7**.
- **Vanilla CSS** in `assets/styles.css` (design tokens as `:root` variables, nesting; no
  Tailwind/DaisyUI).
- **Deno** fmt/lint (tabs, line width in `deno.json`). No Biome / npm scripts.
- **`nodeModulesDir: "manual"`** — run `deno install` after clone or dependency changes.

## Architecture

- **Entry**: `main.ts` → static files + file routes.
- **Layout**: `routes/_app.tsx` — `<html lang="it-IT">`, meta, favicon.
- **Home**: `routes/index.tsx` — server-loads dashboard data via `lib/dashboard_data.ts`, renders
  `Header`, `Dashboard`, `Footer`.
- **API**: `routes/api/*.tsx` — JSON handlers mirroring old Nuxt `server/api/` paths.
- **Upstream HTTP**: `lib/atm_fetch.ts` uses
  `Deno.createHttpClient({ tlsOptions: { insecure: true } })` for `www.atm.it` and
  `giromilano.atm.it` (legacy TLS). Surface alerts use default `fetch` to `alert.atm.it`.
- **HTML parsing**: `happy-dom` in `lib/parser.ts` and data modules (same approach as Nuxt server).
- **Types**: `types/line.ts` (`ScrapedLineStatus`, `MetroLineStatusV2`), `types/news.ts`.

## TypeScript / JSX

- No root `tsconfig.json` (Vite + `deno.json` own TS settings). Do not reintroduce Nuxt’s
  `.nuxt/tsconfig` extends.
- TSX files that render JSX start with `import "preact/jsx-runtime";` so `deno check` resolves
  Fresh’s `jsx: "precompile"` emit cleanly.

## VS Code

`.vscode/settings.json`: tab size 2, format on save. Install the **Deno** extension and enable the
workspace if prompted.
