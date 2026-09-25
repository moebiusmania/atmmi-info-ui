import "preact/jsx-runtime";
import { Card, ErrorMessage, LiveBadge } from "@/components/Card.tsx";
import type { ScrapedLineStatus } from "@/types/line.ts";

export type Tone = "ok" | "warn" | "alert";

const ALERT_STATUSES = ["tratta sospesa", "rallentata"];

export function lineTone(status: string): Tone {
	const s = status.trim().toLocaleLowerCase();
	if (s === "regolare") return "ok";
	return ALERT_STATUSES.some((alert) => s.includes(alert)) ? "alert" : "warn";
}

export interface StatusV1SectionProps {
	items: Array<ScrapedLineStatus> | null;
	error: string | null;
	index: number;
}

export function StatusV1Section(props: StatusV1SectionProps) {
	if (props.error) {
		console.error("StatusV1:", props.error);
	}
	const items = props.items ?? [];

	return (
		<Card
			id="metro"
			title="Linee metropolitana"
			icon="🚇"
			index={props.index}
			badge={<LiveBadge />}
		>
			{props.error
				? <ErrorMessage>Impossibile caricare lo status.</ErrorMessage>
				: (
					<ul class="metro-list">
						{items.map((item, i) => {
							const tone = lineTone(item.status);
							return (
								<li
									key={item.line}
									class={`metro-row metro-row--${tone}`}
									style={`--j: ${i}; --line: var(--color-line-${item.line.toLowerCase()}, var(--color-primary))`}
								>
									<span class="line-badge">{item.line}</span>
									<span class="metro-row__track" aria-hidden="true" />
									<span class={`status-pill status-pill--${tone}`}>
										<span class="status-pill__dot" aria-hidden="true" />
										{item.status}
									</span>
								</li>
							);
						})}
					</ul>
				)}
		</Card>
	);
}
