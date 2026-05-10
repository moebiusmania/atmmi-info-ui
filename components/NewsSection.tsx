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
			<ul class="list-none">
				{items.length === 0 && !props.error
					? <li class="my-2 text-gray-500">Nessuna news.</li>
					: null}
				{props.error ? <li class="my-2 text-error">Impossibile caricare le news.</li> : null}
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
