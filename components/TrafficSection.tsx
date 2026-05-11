import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import type { News } from "@/types/news.ts";

export interface TrafficSectionProps {
	items: Array<News> | null;
	error: string | null;
}

export function TrafficSection(props: TrafficSectionProps) {
	if (props.error) {
		console.error("Traffic:", props.error);
	}
	const items = props.items ?? [];

	return (
		<Card title="Cambiamenti">
			<ul class="link-list">
				{items.length === 0 && !props.error
					? <li class="link-list__item text-muted">Nessun dato.</li>
					: null}
				{props.error
					? (
						<li class="link-list__item message message--error">
							Impossibile caricare i cambiamenti.
						</li>
					)
					: null}
				{items.map((item, index) => (
					<li key={index} class="link-list__item">
						<a
							href={item.url}
							target="_blank"
							rel="nofollow noopener"
							class="link-list__link"
						>
							🔗 {item.text}
						</a>
					</li>
				))}
			</ul>
		</Card>
	);
}
