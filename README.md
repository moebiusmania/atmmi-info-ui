# ATM Milano - Web Dashboard

> This project is not officially affiliated with ATM Milano in any ways, it's just a part-time project.

A clean and modern web UI dashboard that displays some quick informations from the [https://www.atm.it/it/Pagine/default.aspx](https://www.atm.it/it/AtmNews/Pagine/default.aspx) (_a slight messy and non-responsive website_), retrieving the data through a custom REST API.

**Live at:** [https://atmmi-info-ui-moebiusmania.vercel.app/](https://atmmi-info-ui-moebiusmania.vercel.app/)

## Built with

- [Node.js](https://nodejs.org/) v22.x
- [Nuxt 3](https://nuxt.com/) - main application framework based on [Vue 3](https://vuejs.org/)
- [Typescript](https://www.typescriptlang.org/) - static type checking
- [Tailwind.css](https://tailwindcss.com/) - utility-first CSS framework
- [Daisy UI](https://daisyui.com/) - components library built on top of Tailwind.css

## Backend APIs

Since I'm using the Nuxt(3) framework, the APIs are developed and exposed within the project. You can find the source code in the `/server/api` folder and they are exposed by appending the `/api/` suffix at the end of the application URL.

Available routes:

| **Route**      | **Description**               |
| -------------- | ----------------------------- |
| `/api/service` | health check of the API       |
| `/api/status`  | current status of the M lines |
| `/api/traffic` | planned traffic updates       |
| `/api/news`    | ATM news room                 |

## Install & run

Clone the repo:

```
$ git clone https://github.com/moebiusmania/atmmi-info-ui
```

install the dependencies:

```
$ npm ci
```

start the development server:

```
$ npm run dev
```

the application will be available locally in your browser at the url `http://localhost:3000`.

## Development

> **NOTE:** ~~I'm not understanding if the issue comes from my application or the ATM website, but unfortunately to have this application work properly it is required to disable the TLS check in Node.js, this can be done by creating a `.env` file with `NODE_TLS_REJECT_UNAUTHORIZED=0` as content. But I don't want this to be the final solution.~~ Unfortunately moving from Node.js v16 to v18+ brought up an issue when trying to fetching the ATM Milano website, you can check the final solution in the `/server/endpoint.ts` file and read more details on the cause on [an issue that I've opened to Nuxt team](https://github.com/nuxt/nuxt/issues/21609).

Build the project:

```
$ npm run build
```

the result will be available in the `/output` folder and can be deployed on any Node.js hosting.

[Vercel](https://vercel.com/) is the most common and easy to use solution for this scope, and its the one that I'm actually using to deploy this application.

## License

Released under the [MIT](LICENSE) license.
