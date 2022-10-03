# ATM Milano - Web Dashboard

> This project is not officially affiliated with ATM Milano in any ways, it's just a part-time project.

A clean and modern web UI dashboard that displays some quick informations from the [https://www.atm.it/it/Pagine/default.aspx](https://www.atm.it/it/AtmNews/Pagine/default.aspx) (_a slight messy and non-responsive website_), retrieving the data through a custom REST API.

<!-- **Live at:** [https://atmmi-info.appspot.com/](https://atmmi-info.appspot.com/) -->

## Built with

- [Node.js](https://nodejs.org/) v18+
- [Vue 3](https://vuejs.org/) - main UI component library
- [Nuxt 3](https://v3.nuxtjs.org/) - application and API framework
- [Typescript](https://www.typescriptlang.org/) - static type checking
- [Tailwind.css](https://tailwindcss.com/) - utility-first CSS framework
- [Daisy UI](https://daisyui.com/) - components library built on top of Tailwind.css

## Backend APIs

Since I'm using the Nuxt(3) framework, the APIs are developed and exposed within the project. You can find the source code in the `/server/api` folder and they are exposed by appending the `/api/` suffix at the end of the application URL.

Available routes:

| **Route** | **Description** |
|--|--|
| `/api/service`   | health check of the API |
| `/api/status`    | current status of the M lines |
| `/api/traffic`   | planned traffic updates |
| `/api/news`      | ATM news room |

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

Build the project:

```
$ npm run build
```

the result will be available in the `/output` folder and can be deployed on any Node.js hosting.

[Vercel](https://vercel.com/) is the most common and easy to use solution for this scope, and its the one that I'm actually using to deploy this application.

## License

Released under the [MIT](LICENSE) license.
