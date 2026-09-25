import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import { LinkList } from "@/components/LinkList.tsx";
import type { News } from "@/types/news.ts";

export interface TrafficSectionProps {
	items: Array<News> | null;
	error: string | null;
	index: number;
}

export function TrafficSection(props: TrafficSectionProps) {
	if (props.error) {
		console.error("Traffic:", props.error);
	}

	return (
		<Card
			id="traffic"
			title="Cambiamenti"
			icon="🚧"
			index={props.index}
			badge={props.items?.length || undefined}
		>
			<LinkList
				items={props.items}
				error={props.error}
				emptyMessage="Nessun cambiamento in programma."
				errorMessage="Impossibile caricare i cambiamenti."
			/>
		</Card>
	);
}
