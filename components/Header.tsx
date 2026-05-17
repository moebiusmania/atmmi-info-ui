import "preact/jsx-runtime";
import ThemeSwitcher from "@/islands/ThemeSwitcher.tsx";

export function Header() {
	return (
		<header class="site-header">
			<div class="site-header__inner">
				<h1 class="site-header__title">🚌 ATM Milano Info Dashboard</h1>
				<ThemeSwitcher />
			</div>
		</header>
	);
}
