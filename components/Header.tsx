import "preact/jsx-runtime";
import ThemeSwitcher from "@/islands/ThemeSwitcher.tsx";

export function Header() {
	return (
		<header class="site-header">
			<div class="site-header__inner">
				<a href="/" class="brand">
					<span class="brand__mark" aria-hidden="true">M</span>
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
