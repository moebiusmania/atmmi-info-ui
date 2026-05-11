import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import type { News } from "@/types/news.ts";

export interface NewsSectionProps {
	items: Array<News> | null;
	error: string | null;
}

export function NewsSection(props: NewsSectionProps) {
	if (props.error) {
		console.error("News:", props.error);
	}
	const items = (props.items ?? []).slice(0, 7);

	return (
		<Card title="ATM informa">
			<ul class="link-list">
				{items.length === 0 && !props.error
					? <li class="link-list__item text-muted">Nessuna news.</li>
					: null}
				{props.error
					? <li class="link-list__item message message--error">Impossibile caricare le news.</li>
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
