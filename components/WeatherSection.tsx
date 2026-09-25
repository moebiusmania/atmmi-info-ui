import "preact/jsx-runtime";
import { Card } from "@/components/Card.tsx";
import type { Weather } from "@/types/weather.ts";

function degrees(value: number): string {
	return `${Math.round(value)}°`;
}

/** "2026-09-25T18:00" → "18:00" (times are already local to Milan) */
function hour(time: string): string {
	return time.slice(11, 16);
}

export interface WeatherSectionProps {
	weather: Weather | null;
	error: string | null;
}

export function WeatherSection(props: WeatherSectionProps) {
	if (props.error) {
		console.error("Weather:", props.error);
	}
	const w = props.weather;

	return (
		<Card title="Meteo Milano">
			{props.error || !w
				? <p class="message message--error">Impossibile caricare il meteo.</p>
				: (
					<div class="weather">
						<div class="weather__now">
							<span class="weather__icon" aria-hidden="true">{w.condition.icon}</span>
							<span class="weather__temp">{degrees(w.temperature)}</span>
							<div>
								<p class="weather__label">{w.condition.label}</p>
								<p class="weather__meta text-muted">
									Min {degrees(w.min)} · Max {degrees(w.max)}
								</p>
							</div>
						</div>
						<p class="weather__meta text-muted">
							Percepita {degrees(w.apparentTemperature)} · Umidità {w.humidity}% · Vento{" "}
							{Math.round(w.windSpeed)} km/h
						</p>
						{w.hourly.length > 0
							? (
								<ol class="weather__hours">
									{w.hourly.map((h) => (
										<li key={h.time} class="weather__hour" title={h.condition.label}>
											<span class="text-muted">{hour(h.time)}</span>
											<span aria-hidden="true">{h.condition.icon}</span>
											<span>{degrees(h.temperature)}</span>
											<span class="weather__rain text-muted">
												{h.precipitationProbability !== null
													? `💧${h.precipitationProbability}%`
													: ""}
											</span>
										</li>
									))}
								</ol>
							)
							: null}
						<p class="card__source text-muted">
							Aggiornato alle {hour(w.time)} · Dati{" "}
							<a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
								Open-Meteo
							</a>
						</p>
					</div>
				)}
		</Card>
	);
}
