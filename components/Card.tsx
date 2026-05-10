import "preact/jsx-runtime";
import type { ComponentChildren } from "preact";

export interface CardProps {
	title: string;
	children?: ComponentChildren;
}

export function Card(props: CardProps) {
	return (
		<article class="card bg-white shadow-lg">
			<div class="card-body">
				<h2 class="card-title">{props.title}</h2>
				{props.children}
			</div>
		</article>
	);
}
