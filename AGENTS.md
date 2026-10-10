# AGENTS.md — atmmi-info-ui

Single **Go** server (not a monorepo). Dashboard for ATM Milano transit info. See `CLAUDE.md` for
the full architecture notes.

## Commands

| Command                         | Action                                                                  |
| ------------------------------- | ----------------------------------------------------------------------- |
| `go run . -dev`                 | Dev server on :3000; templates/CSS re-read per request, no SW           |
| `go build -o atmmi-info-ui .`   | Production binary with embedded templates, CSS and static files         |
| `./atmmi-info-ui`               | Serve on `$PORT` (or `-addr`), default `:3000`                          |
| `gofmt -l . && go vet ./...`    | Format and vet checks                                                   |
| `go test ./...`                 | Unit tests (data parsing, JS-compat helpers, view logic, template)      |

CI: push to `main` runs gofmt → `go vet` → `go test`; pull requests also run `go build`.

## Architecture

- **Entry**: `main.go` — embeds `assets/`, `static/`, `templates/`; flags `-addr`, `-dev`.
- **Server**: `internal/web/server.go` — routes, static files, CSS build (esbuild Go API), JSON API.
- **Page**: `templates/index.html` + `internal/web/view.go` (view logic per card).
- **API**: `/api/{service,status,v1/status,traffic,news,surface,weather,air}` — JSON from the
  `internal/data` getters.
- **Upstream HTTP**: `internal/atm` uses a client with `InsecureSkipVerify` for `www.atm.it` and
  `giromilano.atm.it` (legacy TLS). Surface alerts, weather and air quality use the normal client.
  All requests send `atm.UserAgent` (ATM rejects Go's default User-Agent).
- **HTML parsing**: goquery in `internal/data/parser.go` and data modules.
- **JS compatibility**: `internal/jsutil` (trim, rounding, number parsing, URL resolution).
