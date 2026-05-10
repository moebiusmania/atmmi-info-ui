# AGENTS.md — atmmi-info-ui

Single Nuxt 4 app (not a monorepo). A dashboard for ATM Milano transit info.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server (localhost:3000) |
| `npm run build` | Nuxt production build (`nuxt build`) |
| `npm run generate` | Static export (`nuxt generate`) |
| `npm run preview` | Preview built app |
| `npm run lint` | Biome lint only |
| `npm run format` | Biome format + write |
| `npm run test` | Vitest + coverage (`vitest run --coverage`) |
| `npm run test:ui` | Vitest UI + coverage |

CI runs: `npm ci` → `npm run lint` → `npm run test` (no build step — build is Vercel's job). CI Node version: 24.13.

`postinstall` hook runs `nuxt prepare` to generate Nuxt types. Run `npm run postinstall` manually if types are stale.

## Framework & Toolchain

- **Nuxt 4** with server routes (auto-registered from `server/api/`), `componentIslands` experiment on, `compatibilityDate: "2024-10-26"`.
- **Tailwind CSS v4** — no `tailwind.config.js`. Configured via `@tailwindcss/vite` plugin in `nuxt.config.ts`. CSS entry: `assets/css/tailwind.css`.
- **Biome** handles both linting and formatting. Config quirks: tab indent, double quotes, CSS parser enables `tailwindDirectives`. Override for `*.vue`: `noUnusedImports` and `noUnusedVariables` off. `organizeImports` is on as an assist action.
- **Vitest** with `happy-dom` environment. Coverage enabled by default (V8, HTML reporter). Setup file `vitest.setup.ts` suppresses Nuxt/Vue Suspense warnings.
- **npm** with `save-exact=true` (all deps pinned). No runtime deps — everything is devDependencies.
- **Node.js** 24.x required. No `.env.example` committed; `.env` in `.gitignore`. May need `NODE_TLS_REJECT_UNAUTHORIZED=0` on older Node builds.

## Testing Conventions

- Tests co-located in `__tests__/` dirs alongside source (e.g., `components/__tests__/`, `server/__tests__/`).
- Test files use `.test.ts` suffix (not `.spec.ts`).
- Single test: `npx vitest run path/to/file.test.ts`
- `happy-dom` is used both as the Vitest DOM environment AND as a server-side HTML parser (`server/parser.ts`).

## Architecture & Quirks

- **App entrypoint**: `app.vue` → renders `<Header />`, `<Dashboard />`, `<Footer />`.
- **Server API routes** are Nuxt server routes in `server/api/`. Endpoints: `/api/service` (health), `/api/status` (v2 JSON via giromilano proxy), `/api/v1/status` (v1 HTML scrape), `/api/traffic`, `/api/news`, `/api/surface`.
- **Two status APIs**: `StatusV1.vue` (HTML scrape, displayed in Dashboard) and `Status.vue` (JSON API, component exists but NOT rendered in Dashboard).
- **SSL bypass**: `server/endpoint.ts` uses `undici` `Agent` with `rejectUnauthorized: false` + `SSL_OP_LEGACY_SERVER_CONNECT` to work around ATM's TLS incompatibility. If the upstream changes their cert, this may need updating.
- **Dynamic cache-busting**: surface API appends a random number (`?${rnd}`) to the alert URL to avoid caching.
- **Import style**: both `~/` path aliases and relative paths are used inconsistently. Follow the convention of the file you're editing.
- **PascalCase** `.vue` component files.
- **DaisyUI 5** theme set in `app.vue` via `<html data-theme="corporate">`.
- **No Nuxt modules** are used (modules array commented out in config).

## VSCode

Settings in `.vscode/settings.json`: tab size 2, format on save enabled.
