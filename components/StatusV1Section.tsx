import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import type { ScrapedLineStatus } from "@/types/line.ts";

const inactive = ["tratta sospesa", "rallentata"];

function lineBadgeClass(line: string): string {
	return `line-badge line-badge--${line}`;
}

function statusTextClass(status: string): string {
	return inactive.includes(status.toLocaleLowerCase())
		? "status-text status-text--alert"
		: "status-text";
}

export interface StatusV1SectionProps {
	items: Array<ScrapedLineStatus> | null;
	error: string | null;
}

export function StatusV1Section(props: StatusV1SectionProps) {
	if (props.error) {
		console.error("StatusV1:", props.error);
	}
	const items = props.items ?? [];

	return (
		<Card title="Status linee MM">
			<ul class="status-list">
				{props.error
					? (
						<li class="status-list__item message message--error">
							Impossibile caricare lo status.
						</li>
					)
					: null}
				{items.map((item, index) => (
					<li key={index} class="status-list__item">
						<div class={lineBadgeClass(item.line)}>
							<span>{item.line}</span>
						</div>
						<span class={statusTextClass(item.status)}>{item.status}</span>
					</li>
				))}
			</ul>
		</Card>
	);
}
