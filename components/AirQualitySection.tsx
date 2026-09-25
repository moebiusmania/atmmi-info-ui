import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import type { AirQualityLevel, Pollutant, PollutantReading } from "@/types/air.ts";

const POLLUTANT_LABELS: Record<Pollutant, string> = {
	pm10: "PM10",
	pm25: "PM2.5",
	no2: "NO₂",
	o3: "O₃",
};

const LEVEL_LABELS: Record<AirQualityLevel, string> = {
	"good": "Buona",
	"fair": "Discreta",
	"moderate": "Moderata",
	"poor": "Scarsa",
	"very-poor": "Molto scarsa",
	"extremely-poor": "Estremamente scarsa",
};

/** "2026-09-24T00:00:00.000" → "24/09" */
function day(time: string): string {
	return `${time.slice(8, 10)}/${time.slice(5, 7)}`;
}

/** "2026-09-25T16:00:00.000" → "16:00" */
function hour(time: string): string {
	return time.slice(11, 16);
}

function periodNote(items: Array<PollutantReading>): string {
	const daily = items.find((item) => item.period === "daily");
	const hourly = items.find((item) => item.period === "hourly");
	return [
		daily ? `PM: media giornaliera del ${day(daily.time)}` : null,
		hourly ? `NO₂/O₃: media oraria delle ${hour(hourly.time)}` : null,
	].filter(Boolean).join(" · ");
}

export interface AirQualitySectionProps {
	items: Array<PollutantReading> | null;
	error: string | null;
}

export function AirQualitySection(props: AirQualitySectionProps) {
	if (props.error) {
		console.error("Air:", props.error);
	}
	const items = props.items ?? [];

	return (
		<Card title="Qualità dell'aria">
			{props.error ? <p class="message message--error">Impossibile caricare i dati.</p> : null}
			{!props.error && items.length === 0 ? <p>Nessun dato disponibile</p> : null}
			{!props.error && items.length > 0
				? (
					<>
						<ul class="air-list">
							{items.map((item) => (
								<li key={item.pollutant} class="air-list__item">
									<span class={`aqi-dot aqi-dot--${item.level}`} aria-hidden="true" />
									<span class="air-list__name">{POLLUTANT_LABELS[item.pollutant]}</span>
									<span class="air-list__value">
										{item.value} <span class="text-muted">µg/m³</span>
									</span>
									<span class="air-list__level">{LEVEL_LABELS[item.level]}</span>
								</li>
							))}
						</ul>
						<p class="card__source text-muted">
							{periodNote(items)}. Media delle stazioni di Milano, livelli secondo l'
							<a
								href="https://airindex.eea.europa.eu/AQI/index.html"
								target="_blank"
								rel="noopener noreferrer"
							>
								indice europeo
							</a>. Dati{" "}
							<a
								href="https://www.arpalombardia.it/temi-ambientali/aria/"
								target="_blank"
								rel="noopener noreferrer"
							>
								ARPA Lombardia
							</a>
						</p>
					</>
				)
				: null}
		</Card>
	);
}
