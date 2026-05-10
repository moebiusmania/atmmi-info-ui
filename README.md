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
- [Tailwind CSS](https://tailwindcss.com/) v4 with Vite
- [DaisyUI](https://daisyui.com/) — components on top of Tailwind

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

Open the URL printed in the terminal (Vite defaults to `http://localhost:5173` unless configured
otherwise).

## Development

Upstream ATM / giromilano endpoints may require a permissive TLS client for certificate
compatibility. This app uses `Deno.createHttpClient({ tlsOptions: { insecure: true } })` for those
fetches only (see `lib/atm_fetch.ts` and the
[Nuxt TLS discussion](https://github.com/nuxt/nuxt/issues/21609)).

Build for production:

```
deno task build
```

Serve the production build:

```
deno task start
```

## License

Released under the [MIT](LICENSE) license.
