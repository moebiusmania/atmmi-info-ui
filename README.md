# ATM Milano - Web Dashboard

> This project is not officially affiliated with ATM Milano in any ways, it's just a part-time project.

A clean and modern web UI dashboard that displays some quick informations from the [ATM Milano news website](https://www.atm.it/it/AtmNews/Pagine/default.aspx) (_a messy and non-responsive website_), retrieving the data through a custom REST API.

<!-- **Live at:** [https://atmmi-info.appspot.com/](https://atmmi-info.appspot.com/) -->

## Built with

- [Node.js](https://nodejs.org/) v18+
- [Vue 3](https://vuejs.org/) - main UI component library
- [Nuxt 3](https://v3.nuxtjs.org/) - application and API framework
- [Typescript](https://www.typescriptlang.org/) - static type checking
- [Tailwind.css](https://tailwindcss.com/) - utility-first CSS framework
- [Daisy UI](https://daisyui.com/) - components library built on top of Tailwind.css

## Backend APIs

This application works in tandem with the [moebiusmania/atmmi-info-api](https://github.com/moebiusmania/atmmi-info-api) project which provides the REST APIs that are consumed.

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

Build the deployable package:

```
$ npm run build
```

the files will be available in the `/dist` folder.

## License

Released under the [MIT](LICENSE) license.
