// deno-lint-ignore-file react-no-danger
import "preact/jsx-runtime";
import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
	return (
		<html lang="it-IT">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="ATM Milano info & status dashboard webapp." />
				<meta name="author" content="Salvatore Laisa" />
				<meta name="theme-color" content="#f58220" />
				<meta name="apple-mobile-web-app-title" content="ATM Info" />
				<meta name="mobile-web-app-capable" content="yes" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link rel="icon" href="/icon-32.png" sizes="32x32" type="image/png" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.webmanifest" />
				<title>ATM Milano Info Dashboard</title>
			</head>
			<body>
				<script
					dangerouslySetInnerHTML={{
						__html:
							`(function(){var s=localStorage.getItem('atmmi-theme');if(s==='dark'||s==='light'){document.documentElement.dataset.theme=s;}else if(matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark';}})();`,
					}}
				/>
				<Component />
				{
					// Registered only in production builds: in dev its cache would interfere with Vite HMR.
					import.meta.env.PROD
						? (
							<script
								dangerouslySetInnerHTML={{
									__html:
										`if('serviceWorker' in navigator){addEventListener('load',function(){navigator.serviceWorker.register('/sw.js');});}`,
								}}
							/>
						)
						: null
				}
			</body>
		</html>
	);
});
