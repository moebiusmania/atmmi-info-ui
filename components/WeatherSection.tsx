import "preact/jsx-runtime";
import { Card, ErrorMessage } from "@/components/Card.tsx";
import type { Weather } from "@/types/weather.ts";

export function degrees(value: number): string {
	return `${Math.round(value)}°`;
}

/** "2026-09-25T18:00" → "18:00" (times are already local to Milan) */
function hour(time: string): string {
	return time.slice(11, 16);
}

export interface WeatherSectionProps {
	weather: Weather | null;
	error: string | null;
	index: number;
}

export function WeatherSection(props: WeatherSectionProps) {
	if (props.error) {
		console.error("Weather:", props.error);
	}
	const w = props.weather;

	return (
		<Card
			id="weather"
			title="Meteo Milano"
			icon="🌤️"
			index={props.index}
			badge={w ? hour(w.time) : undefined}
		>
			{props.error || !w
				? <ErrorMessage>Impossibile caricare il meteo.</ErrorMessage>
				: (
					<div class="weather">
						<div class="weather__now">
							<span class="weather__icon" aria-hidden="true">{w.condition.icon}</span>
							<div>
								<p class="weather__temp">{degrees(w.temperature)}</p>
								<p class="weather__label">{w.condition.label}</p>
							</div>
							<p class="weather__range">
								<span>
									<span class="text-muted">Max</span> {degrees(w.max)}
								</span>
								<span>
									<span class="text-muted">Min</span> {degrees(w.min)}
								</span>
							</p>
						</div>
						<dl class="weather__stats">
							<div>
								<dt>Percepita</dt>
								<dd>{degrees(w.apparentTemperature)}</dd>
							</div>
							<div>
								<dt>Umidità</dt>
								<dd>{w.humidity}%</dd>
							</div>
							<div>
								<dt>Vento</dt>
								<dd>{Math.round(w.windSpeed)} km/h</dd>
							</div>
						</dl>
						{w.hourly.length > 0
							? (
								<ol class="weather__hours">
									{w.hourly.map((h, i) => (
										<li
											key={h.time}
											class="weather__hour"
											style={`--j: ${i}`}
											title={h.condition.label}
										>
											<span class="text-muted">{hour(h.time)}</span>
											<span class="weather__hour-icon" aria-hidden="true">{h.condition.icon}</span>
											<strong>{degrees(h.temperature)}</strong>
											<span class="weather__rain">
												{h.precipitationProbability ? `💧${h.precipitationProbability}%` : ""}
											</span>
										</li>
									))}
								</ol>
							)
							: null}
						<p class="card__source">
							Dati{" "}
							<a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
								Open-Meteo
							</a>
						</p>
					</div>
				)}
		</Card>
	);
}
