import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";

export function StaticMapSection() {
	return (
		<Card title="Mappa linee metropolitana">
			<div class="map-section">
				<a
					href="https://giromilano.atm.it/assets/images/schema_rete_metro.jpg"
					target="_blank"
					rel="nofollow noopener"
					class="map-section__link"
				>
					<img
						loading="lazy"
						class="map-section__img"
						src="https://giromilano.atm.it/assets/images/schema_rete_metro.jpg"
						alt="Mappa linee metropolitana"
					/>
				</a>
			</div>
		</Card>
	);
}
