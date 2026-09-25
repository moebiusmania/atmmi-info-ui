import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";

const MAP_URL = "https://giromilano.atm.it/assets/images/schema_rete_metro.jpg";

export function StaticMapSection(props: { index: number }) {
	return (
		<Card id="map" title="Mappa metropolitana" icon="🗺️" index={props.index}>
			<a href={MAP_URL} target="_blank" rel="nofollow noopener" class="map">
				<img loading="lazy" class="map__img" src={MAP_URL} alt="Mappa linee metropolitana" />
				<span class="map__hint">Apri a schermo intero ↗</span>
			</a>
		</Card>
	);
}
