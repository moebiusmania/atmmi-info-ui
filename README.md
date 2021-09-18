# ATM Milano - Web Dashboard

> This project is not officially affiliated with ATM Milano in any ways, it's just a part-time project.

A clean and modern web UI dashboard that displays some quick informations from the [ATM Milano news website](https://www.atm.it/it/AtmNews/Pagine/default.aspx) (*a messy and non-responsive website*), retrieving the data through a custom REST API.

<!-- **Live at:** [https://atmmi-info.appspot.com/](https://atmmi-info.appspot.com/) -->

## Built with
* [Node.js](https://nodejs.org/) v16+
* [React](https://reactjs.org/) - main UI framework
* [Typescript](https://www.typescriptlang.org/) - static type checking
* [Tailwind.css](https://tailwindcss.com/) - utility-first CSS framework
* [Daisy UI](https://daisyui.com/) -  components library built on top of Tailwind.css

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
$ npm start
```

the application will be available locally in your browser at the url `http://localhost:3000`.

## Development
Build the deployable package:
```
$ npm run build
```

the files will be available in the `/build` folder.

## License
Released under the [MIT](LICENSE) license.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
