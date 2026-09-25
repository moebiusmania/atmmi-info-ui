import "preact/jsx-runtime";
import ThemeSwitcher from "@/islands/ThemeSwitcher.tsx";

export function Header() {
	return (
		<header class="site-header">
			<div class="site-header__inner">
				<a href="/" class="brand">
					<img class="brand__mark" src="/logo.svg" alt="" width="40" height="40" />
					<div class="brand__text">
						<h1 class="brand__title">ATM Milano Info</h1>
						<span class="brand__subtitle">Dashboard mobilità</span>
					</div>
				</a>
				<ThemeSwitcher />
			</div>
		</header>
	);
}
