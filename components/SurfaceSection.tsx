import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";

export interface SurfaceSectionProps {
	items: Array<string> | null;
	error: string | null;
}

export function SurfaceSection(props: SurfaceSectionProps) {
	if (props.error) {
		console.error("Surface:", props.error);
	}
	const data = props.items ?? [];

	return (
		<Card title="Linee di superficie">
			{props.error ? <p class="text-error">Impossibile caricare gli avvisi.</p> : null}
			{!props.error && data.length > 0 ? data.map((item, i) => <p key={i}>{item}</p>) : null}
			{!props.error && data.length === 0 ? <p>☀️ Nessun avviso disponibile</p> : null}
		</Card>
	);
}
