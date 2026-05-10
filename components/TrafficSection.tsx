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
			<ul>
				{items.length === 0 && !props.error
					? <li class="my-2 text-gray-500">Nessun dato.</li>
					: null}
				{props.error ? <li class="my-2 text-error">Impossibile caricare i cambiamenti.</li> : null}
				{items.map((item, index) => (
					<li key={index} class="my-2 align-middle">
						<a
							href={item.url}
							target="_blank"
							rel="nofollow noopener"
							class="hover:underline hover:text-primary"
						>
							🔗 {item.text}
						</a>
					</li>
				))}
			</ul>
		</Card>
	);
}
