import "preact/jsx-runtime";
import { Card, ErrorMessage } from "@/components/Card.tsx";

// Alerts start with an emoji describing their kind, e.g. "🚧 Cantieri: ...", "🅿️ Parcheggio ...".
const LEADING_EMOJI = /^(\p{Extended_Pictographic}️?)\s*/u;

/** Splits an alert into icon, headline (first sentence, if short) and remaining text. */
function splitAlert(text: string): { icon: string; title: string; rest: string } {
	const match = text.match(LEADING_EMOJI);
	const icon = match ? match[1] : "ℹ️";
	const body = match ? text.slice(match[0].length) : text;
	const end = body.indexOf(". ");
	return end > 0 && end < 80
		? { icon, title: body.slice(0, end + 1), rest: body.slice(end + 2) }
		: { icon, title: body, rest: "" };
}

export interface SurfaceSectionProps {
	items: Array<string> | null;
	error: string | null;
	index: number;
}

export function SurfaceSection(props: SurfaceSectionProps) {
	if (props.error) {
		console.error("Surface:", props.error);
	}
	const items = props.items ?? [];

	return (
		<Card
			id="surface"
			title="Linee di superficie"
			icon="🚌"
			index={props.index}
			badge={items.length || undefined}
		>
			{props.error ? <ErrorMessage>Impossibile caricare gli avvisi.</ErrorMessage> : null}
			{!props.error && items.length === 0
				? <p class="empty">☀️ Nessun avviso, tutto regolare</p>
				: null}
			{!props.error && items.length > 0
				? (
					<ul class="alert-list">
						{items.map((item, i) => {
							const { icon, title, rest } = splitAlert(item);
							return (
								<li key={i} class="alert-list__item" style={`--j: ${i}`}>
									<span class="alert-list__icon" aria-hidden="true">{icon}</span>
									<p class="alert-list__text">
										<strong>{title}</strong>
										{rest ? ` ${rest}` : null}
									</p>
								</li>
							);
						})}
					</ul>
				)
				: null}
		</Card>
	);
}
