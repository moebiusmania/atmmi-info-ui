# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

Unofficial dashboard for ATM Milano transit info (metro status, surface alerts, traffic, news,
weather, air quality), built as a single **Go** server: standard library `net/http` +
`html/template`, `goquery` for scraping, esbuild's Go API for the stylesheet. It builds to one
self-contained binary (templates, CSS and `static/` are embedded via `//go:embed` in `main.go`). UI
copy is Italian (`<html lang="it-IT">`). It was ported from a Deno/Fresh app and keeps its output
(HTML, CSS and JSON API responses) identical.

## Commands

```sh
go run . -dev                        # dev server on :3000, re-reads templates/ and assets/ per request, no service worker
go build -o atmmi-info-ui .          # production binary (listens on $PORT or -addr, default :3000)
go test ./...                        # all tests
go test ./internal/data -run TestSummarizeReadings   # single test
gofmt -l . && go vet ./...           # what CI checks (gofmt -w . to fix)
```

`-dev` reads files with `os.DirFS(".")`, so run it from the repo root. CI
(`.github/workflows/`): push to `main` runs gofmt → vet → test; PRs additionally run `go build`.

## Architecture

**Request flow.** `main.go` → `internal/web.New()` registers the routes on a `ServeMux`. The home
page (`GET /{$}`) is fully server-rendered: it calls `data.LoadDashboardData()`, which runs all
upstream fetches concurrently and returns a `DashboardData` with a `Result[T]{Value, Err}` per
section (panics are recovered into errors). `internal/web/view.go` turns it into `pageData` (the
logic of the old Preact components: tones, badges, tiles, alert/date splitting) and
`templates/index.html` renders either the data or the error message per section — one failing
upstream must not break the page. The only client-side JS is inline in the template: the theme
switcher (sets `html[data-theme]`, persisted in `localStorage` as `atmmi-theme`) and the service
worker registration.

**Data layer (`internal/data`).** One file per upstream source; each exports a `Get*(ctx)` function
shared by the dashboard loader and the matching JSON endpoint (`jsonHandler(data.GetX)` in
`server.go`). `GetV2Statuses` (giromilano JSON API) backs `/api/status` but is not shown on the
dashboard; the dashboard uses the scraped `GetV1Statuses`.

**Upstream HTTP.** `internal/atm` exposes `GetPage()` (ATM homepage HTML) and `GetAPI()`
(giromilano JSON); both use a client with `InsecureSkipVerify` because of legacy upstream
certificates — keep that client scoped to these hosts only. Surface alerts (`alert.atm.it`),
weather (Open-Meteo, no key) and air quality (ARPA Lombardia via the dati.lombardia.it Socrata API)
use the normal client in `internal/data/fetch.go`. Every request sends `atm.UserAgent`: www.atm.it
answers HTTP 500 to Go's default User-Agent. `air.go` hardcodes the Milan ARPA sensor IDs and
averages them per pollutant; NO₂/O₃ are hourly, PM10/PM2.5 are previous-day daily averages.

**HTML scraping.** goquery selectors in `internal/data/parser.go` and the data files depend on
ATM's markup (e.g. `.StatusLinee_StatoScritta`), so upstream site changes break them.

**JS semantics.** `internal/jsutil` mirrors the JavaScript behaviour the original relied on
(`trim()` whitespace set, `Math.round`, `Number()`, `new URL(ref, base)`). Use it instead of
`strings.TrimSpace`/`math.Round` in data and view code so output stays identical.
`internal/web/pictographic.go` is a generated `\p{Extended_Pictographic}` table (Go's regexp has no
emoji properties).

**Templates.** `templates/index.html` is preprocessed by `jsxWhitespace()` (`render.go`): lines are
trimmed and joined with a space only between two runs of text, as in JSX. Write `{{" "}}` where a
space is needed next to a tag or action, and keep inline `<script>`s on one line. Cards are wrapped
with `{{template "card_open" .XCard}} … {{template "card_close"}}`.

**CSS & static files.** `assets/styles.css` is minified and nesting-lowered by esbuild at startup
(same targets as Vite's default build) and served at `/assets/styles-<hash>.css` with immutable
caching. `static/` is served at the site root: `manifest.webmanifest`, `sw.js` (network-first for
pages with offline fallback, cache-first for `/assets/` and icons) and the icons. The PNG icons are
rendered from `favicon.svg`; the header uses `logo.svg` (same tile without the orange frame) —
regenerate the PNGs if you change either.

## Conventions

- Styling is vanilla CSS in `assets/styles.css`: design tokens as `:root` custom properties, dark
  theme overrides under `html[data-theme="dark"]`, CSS nesting. No Tailwind/utility framework.
- Dashboard layout is a CSS grid with named areas per breakpoint (`.dashboard__grid`, 1/2/3
  columns); each card gets `card--<id>` for its area. Load animations are staggered through the
  `--i` (card/tile index, `card.Index`) and `--j` (row index) custom properties; a
  `prefers-reduced-motion` block at the end of `styles.css` disables all motion.
- Return non-nil empty slices from data functions so the JSON API emits `[]`, not `null`.
- Tests are plain `testing` (no assertion library); template rendering is covered in
  `internal/web/view_test.go`.
