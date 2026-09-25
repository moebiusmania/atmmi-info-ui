# ATM Milano - Web Dashboard

> This project is not officially affiliated with ATM Milano in any ways, it's just a part-time
> project.

A clean and modern web UI dashboard that displays some quick informations from the
[https://www.atm.it/it/Pagine/default.aspx](https://www.atm.it/it/AtmNews/Pagine/default.aspx) (_a
slight messy and non-responsive website_), retrieving the data through a custom REST API.

**Live at:**
[https://atmmi-info-ui.moebiusmania.deno.net/](https://atmmi-info-ui.moebiusmania.deno.net/)

## Built with

- [Deno](https://deno.com/) v2.x
- [Fresh](https://fresh.deno.dev/) — full-stack framework with Preact and file-system routing
- [TypeScript](https://www.typescriptlang.org/)
- Vanilla CSS (`assets/styles.css`) — variables, nesting, no utility framework

Live version hosted on [Deno Deploy](https://deno.com/deploy).

## Backend APIs

APIs live under `/api/` (see `routes/api/`).

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

Clone the repo:

```
git clone https://github.com/moebiusmania/atmmi-info-ui
cd atmmi-info-ui
```

Install npm dependencies (Tailwind / Fresh build toolchain) and cache:

```
deno install
```

Start the development server:

```
deno task dev
```

Open [http://localhost:3000](http://localhost:3000) (port set in `vite.config.ts`). Use
`deno task dev:host` to also expose the dev server on your local network.

## Development

Upstream ATM / giromilano endpoints may require a permissive TLS client for certificate
compatibility. This app uses `Deno.createHttpClient({ tlsOptions: { insecure: true } })` for those
fetches only (see `lib/atm_fetch.ts` and the
[Nuxt TLS discussion](https://github.com/nuxt/nuxt/issues/21609)).

Build for production:

```
deno task build
```

The app is an installable PWA (`static/manifest.webmanifest`, `static/sw.js`). The service worker is
registered only in production builds and needs a secure context (HTTPS or `localhost`). Icons in
`static/` are rendered from `static/favicon.svg` / `static/logo.svg`.

Serve the production build:

```
deno task start
```

## License

Released under the [MIT](LICENSE) license.
