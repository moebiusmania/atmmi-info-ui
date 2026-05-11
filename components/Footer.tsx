import "preact/jsx-runtime";
export function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer class="site-footer">
			<p class="site-footer__line">
				<span>{year}</span> - Sviluppato da{" "}
				<a
					href="https://github.com/moebiusmania/atmmi-info-ui"
					target="_blank"
					class="site-footer__link"
					rel="noopener noreferrer"
				>
					Salvatore Laisa
				</a>
			</p>
			<p class="site-footer__line">
				Progetto indipendente e non affiliato o supportato da ATM Milano S.p.A.
			</p>
		</footer>
	);
}
