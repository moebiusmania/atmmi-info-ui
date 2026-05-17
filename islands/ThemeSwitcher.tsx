import { useEffect, useState } from "preact/hooks";

type Theme = "light" | "dark";

const STORAGE_KEY = "atmmi-theme";

function getInitialTheme(): Theme {
	if (typeof localStorage !== "undefined") {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "dark" || stored === "light") return stored;
	}
	if (typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches) {
		return "dark";
	}
	return "light";
}

function applyTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme;
}

export default function ThemeSwitcher() {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const initial = getInitialTheme();
		setTheme(initial);
		applyTheme(initial);
	}, []);

	function toggle() {
		const next: Theme = theme === "light" ? "dark" : "light";
		setTheme(next);
		applyTheme(next);
		localStorage.setItem(STORAGE_KEY, next);
	}

	return (
		<button
			class="theme-switcher"
			onClick={toggle}
			aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
			title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
		>
			{theme === "light" ? "🌙" : "☀️"}
		</button>
	);
}
