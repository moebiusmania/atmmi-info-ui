# ATM Milano - Web Dashboard

> This project is not officially affiliated with ATM Milano in any ways, it's just a part-time
> project.

A clean and modern web UI dashboard that displays some quick informations from the
[https://www.atm.it/it/Pagine/default.aspx](https://www.atm.it/it/AtmNews/Pagine/default.aspx) (_a
slight messy and non-responsive website_), retrieving the data through a custom REST API.

**Live at:**
[https://atmmi-info-ui.onrender.com](https://atmmi-info-ui.onrender.com)

## Built with

- [Go](https://go.dev/) — standard library HTTP server and `html/template`, server-rendered
- [goquery](https://github.com/PuerkitoBio/goquery) — HTML scraping
- [esbuild](https://esbuild.github.io/) (Go API) — minifies the stylesheet at startup
- Vanilla CSS (`assets/styles.css`) — variables, nesting, no utility framework

The app compiles to a single self-contained binary (templates, CSS and static files are embedded).

Live version hosted on [Render](https://render.com/).

## Backend APIs

APIs live under `/api/` (see `internal/web/server.go`).

| **Route**        | **Description**                          |
| ---------------- | ---------------------------------------- |
| `/api/service`   | health check of the API                  |
| `/api/status`    | current status of the M lines (JSON API) |
| `/api/v1/status` | scraped line status from ATM homepage    |
| `/api/traffic`   | planned traffic updates                  |
| `/api/news`      | ATM news room                            |
| `/api/surface`   | surface line alerts                      |
| `/api/weather`   | Milan weather (Open-Meteo)               |
| `/api/air`       | Milan air quality (ARPA Lombardia)       |

## Data sources

| **Data**                                         | **Source**                                                                                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Metro status, traffic changes, news              | scraped from the [ATM homepage](https://www.atm.it/it/Pagine/default.aspx) and [GiroMilano](https://giromilano.atm.it/) API                                                     |
| Surface line alerts                              | [alert.atm.it](https://alert.atm.it/it)                                                                                                                                         |
| Weather (current, today's min/max, next 6 hours) | [Open-Meteo](https://open-meteo.com/) forecast API — free, no API key, data under [CC BY 4.0](https://open-meteo.com/en/license)                                                |
| Air quality (PM10, PM2.5, NO₂, O₃)               | [ARPA Lombardia](https://www.arpalombardia.it/temi-ambientali/aria/) measurements via [Open Data Lombardia](https://www.dati.lombardia.it/Ambiente/Dati-sensori-aria/nicp-bhqi) |

Air quality values are the average of the ARPA monitoring stations in Milan (via Senato, Verziere,
Pascal Città Studi, via Liguria, via Marche). NO₂ and O₃ are hourly values; PM10 and PM2.5 are
published as daily averages for the previous day. Levels follow the
[European Air Quality Index](https://airindex.eea.europa.eu/AQI/index.html) bands.

## Install & run

Requires Go (version in `go.mod`). Clone the repo:

```
git clone https://github.com/moebiusmania/atmmi-info-ui
cd atmmi-info-ui
```

Start the development server (templates and CSS are re-read from disk on every request, the
service worker is disabled):

```
go run . -dev
```

Open [http://localhost:3000](http://localhost:3000). The server listens on all interfaces, so it is
also reachable from your local network.

## Development

Upstream ATM / giromilano endpoints may require a permissive TLS client for certificate
compatibility. This app skips certificate verification for those fetches only (see
`internal/atm/fetch.go` and the [Nuxt TLS discussion](https://github.com/nuxt/nuxt/issues/21609)).

Run the checks and tests:

```
gofmt -l . && go vet ./...
go test ./...
```

Build and run for production:

```
go build -o atmmi-info-ui .
PORT=8000 ./atmmi-info-ui        # or ./atmmi-info-ui -addr :8000; default port 3000
```

The app is an installable PWA (`static/manifest.webmanifest`, `static/sw.js`). The service worker is
registered only without `-dev` and needs a secure context (HTTPS or `localhost`). Icons in
`static/` are rendered from `static/favicon.svg` / `static/logo.svg`.

## License

Released under the [MIT](LICENSE) license.
