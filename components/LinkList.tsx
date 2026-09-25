import "preact/jsx-runtime";
import { ErrorMessage } from "@/components/Card.tsx";
import type { News } from "@/types/news.ts";

// Traffic items end with their publication date, e.g. "La 70 arriva in via ... - 09/09".
const DATE_SUFFIX = /\s+-\s+(\d{2}\/\d{2})$/;

function splitDate(text: string): { text: string; date: string | null } {
	const match = text.match(DATE_SUFFIX);
	return match ? { text: text.slice(0, match.index), date: match[1] } : { text, date: null };
}

export interface LinkListProps {
	items: Array<News> | null;
	error: string | null;
	emptyMessage: string;
	errorMessage: string;
}

export function LinkList(props: LinkListProps) {
	if (props.error) return <ErrorMessage>{props.errorMessage}</ErrorMessage>;

	const items = props.items ?? [];
	if (items.length === 0) return <p class="text-muted">{props.emptyMessage}</p>;

	return (
		<ul class="link-list">
			{items.map((item, i) => {
				const { text, date } = splitDate(item.text);
				return (
					<li key={i} class="link-list__item" style={`--j: ${i}`}>
						<a href={item.url} target="_blank" rel="nofollow noopener" class="link-list__link">
							<span class="link-list__text">{text}</span>
							{date ? <span class="chip">{date}</span> : null}
							<span class="link-list__arrow" aria-hidden="true">→</span>
						</a>
					</li>
				);
			})}
		</ul>
	);
}
