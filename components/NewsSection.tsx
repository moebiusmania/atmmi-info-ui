import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import { LinkList } from "@/components/LinkList.tsx";
import type { News } from "@/types/news.ts";

export interface NewsSectionProps {
	items: Array<News> | null;
	error: string | null;
	index: number;
}

export function NewsSection(props: NewsSectionProps) {
	if (props.error) {
		console.error("News:", props.error);
	}

	return (
		<Card id="news" title="ATM informa" icon="📰" index={props.index}>
			<LinkList
				items={props.items?.slice(0, 7) ?? null}
				error={props.error}
				emptyMessage="Nessuna news."
				errorMessage="Impossibile caricare le news."
			/>
		</Card>
	);
}
