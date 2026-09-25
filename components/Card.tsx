import "preact/jsx-runtime";
import type { ComponentChildren } from "preact";

export interface CardProps {
	title: string;
	icon: string;
	/** Anchor id, also used for the grid area (`card--<id>`) */
	id: string;
	/** Position in the page, drives the staggered load animation */
	index: number;
	badge?: ComponentChildren;
	children?: ComponentChildren;
}

export function Card(props: CardProps) {
	return (
		<article class={`card card--${props.id}`} id={props.id} style={`--i: ${props.index}`}>
			<header class="card__header">
				<span class="card__icon" aria-hidden="true">{props.icon}</span>
				<h2 class="card__title">{props.title}</h2>
				{props.badge !== undefined ? <span class="card__badge">{props.badge}</span> : null}
			</header>
			<div class="card__body">{props.children}</div>
		</article>
	);
}

/** Pulsing "live" badge content for cards showing real-time data */
export function LiveBadge() {
	return (
		<span class="live">
			<span class="live__dot" aria-hidden="true" />
			Live
		</span>
	);
}

export function ErrorMessage(props: { children: ComponentChildren }) {
	return <p class="message message--error">⚠️ {props.children}</p>;
}
