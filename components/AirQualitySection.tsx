import "preact/jsx-runtime";
import { Card, ErrorMessage } from "@/components/Card.tsx";
import { AIR_QUALITY_LEVELS } from "@/lib/data/air.ts";
import type { AirQualityLevel, Pollutant, PollutantReading } from "@/types/air.ts";

const POLLUTANT_LABELS: Record<Pollutant, string> = {
	pm10: "PM10",
	pm25: "PM2.5",
	no2: "NO₂",
	o3: "O₃",
};

export const LEVEL_LABELS: Record<AirQualityLevel, string> = {
	"good": "Buona",
	"fair": "Discreta",
	"moderate": "Moderata",
	"poor": "Scarsa",
	"very-poor": "Molto scarsa",
	"extremely-poor": "Estremamente scarsa",
};

/** Worst level among the readings, or null when there are none */
export function worstLevel(items: Array<PollutantReading>): AirQualityLevel | null {
	return items.reduce<AirQualityLevel | null>(
		(worst, item) =>
			worst === null ||
				AIR_QUALITY_LEVELS.indexOf(item.level) > AIR_QUALITY_LEVELS.indexOf(worst)
				? item.level
				: worst,
		null,
	);
}

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

function Meter(props: { level: AirQualityLevel }) {
	const current = AIR_QUALITY_LEVELS.indexOf(props.level);
	return (
		<span class="aqi-meter" aria-hidden="true">
			{AIR_QUALITY_LEVELS.map((level, i) => (
				<span
					key={level}
					class={`aqi-meter__seg${i <= current ? " is-on" : ""}${
						i === current ? " is-current" : ""
					}`}
					style={`--seg: var(--color-aqi-${level}); --k: ${i}`}
				/>
			))}
		</span>
	);
}

export interface AirQualitySectionProps {
	items: Array<PollutantReading> | null;
	error: string | null;
	index: number;
}

export function AirQualitySection(props: AirQualitySectionProps) {
	if (props.error) {
		console.error("Air:", props.error);
	}
	const items = props.items ?? [];
	const worst = worstLevel(items);

	return (
		<Card
			id="air"
			title="Qualità dell'aria"
			icon="🍃"
			index={props.index}
			badge={worst ? LEVEL_LABELS[worst] : undefined}
		>
			{props.error ? <ErrorMessage>Impossibile caricare i dati.</ErrorMessage> : null}
			{!props.error && items.length === 0 ? <p class="empty">Nessun dato disponibile</p> : null}
			{!props.error && items.length > 0
				? (
					<>
						<ul class="air-list">
							{items.map((item, i) => (
								<li key={item.pollutant} class="air-list__item" style={`--j: ${i}`}>
									<span class="air-list__name">{POLLUTANT_LABELS[item.pollutant]}</span>
									<span class="air-list__value">
										{item.value} <small>µg/m³</small>
									</span>
									<span class={`air-list__level air-list__level--${item.level}`}>
										{LEVEL_LABELS[item.level]}
									</span>
									<Meter level={item.level} />
								</li>
							))}
						</ul>
						<p class="card__source">
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
