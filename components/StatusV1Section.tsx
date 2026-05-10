import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import type { ScrapedLineStatus } from "@/types/line.ts";

const inactive = ["tratta sospesa", "rallentata"];

function lineClass(line: string): string {
	return `badge badge-lg bg-line-${line} rounded-none border-0 w-10`;
}

function notActive(status: string): string {
	return inactive.includes(status.toLocaleLowerCase()) ? "font-bold" : "font-normal";
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
			<ul>
				{props.error ? <li class="my-2 text-error">Impossibile caricare lo status.</li> : null}
				{items.map((item, index) => (
					<li key={index} class="my-2">
						<div class={lineClass(item.line)}>
							<span class="text-base-100">{item.line}</span>
						</div>{" "}
						<span class={notActive(item.status)}>{item.status}</span>
					</li>
				))}
			</ul>
		</Card>
	);
}
