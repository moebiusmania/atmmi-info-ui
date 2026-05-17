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
				<link
					rel="icon"
					href="https://www.atm.it/_layouts/atm/images/favicon.ico"
					type="image/x-icon"
				/>
				<title>🚌 ATM Milano Info Dashboard</title>
			</head>
			<body>
				<script
					dangerouslySetInnerHTML={{
						__html:
							`(function(){var s=localStorage.getItem('atmmi-theme');if(s==='dark'||s==='light'){document.documentElement.dataset.theme=s;}else if(matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark';}})();`,
					}}
				/>
				<Component />
			</body>
		</html>
	);
});
