import type { HourlyForecast, Weather, WeatherCondition } from "@/types/weather.ts";

const API = "https://api.open-meteo.com/v1/forecast";

// Milano, Piazza del Duomo
const LATITUDE = 45.4642;
const LONGITUDE = 9.19;

const HOURS_AHEAD = 6;

export type OpenMeteoResponse = {
	current: {
		time: string;
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		weather_code: number;
		wind_speed_10m: number;
		is_day: number;
	};
	hourly: {
		time: Array<string>;
		temperature_2m: Array<number>;
		precipitation_probability: Array<number | null>;
		weather_code: Array<number>;
		is_day: Array<number>;
	};
	daily: {
		temperature_2m_max: Array<number>;
		temperature_2m_min: Array<number>;
	};
};

/**
 * Maps a WMO weather interpretation code (as returned by Open-Meteo) to an Italian label and icon.
 */
export function describeWeatherCode(code: number, isDay = true): WeatherCondition {
	switch (code) {
		case 0:
			return { label: "Sereno", icon: isDay ? "☀️" : "🌙" };
		case 1:
			return { label: "Prevalentemente sereno", icon: isDay ? "🌤️" : "🌙" };
		case 2:
			return { label: "Parzialmente nuvoloso", icon: "⛅" };
		case 3:
			return { label: "Coperto", icon: "☁️" };
		case 45:
		case 48:
			return { label: "Nebbia", icon: "🌫️" };
		case 51:
		case 53:
		case 55:
			return { label: "Pioviggine", icon: "🌦️" };
		case 56:
		case 57:
			return { label: "Pioviggine gelata", icon: "🌧️" };
		case 61:
			return { label: "Pioggia debole", icon: "🌧️" };
		case 63:
			return { label: "Pioggia", icon: "🌧️" };
		case 65:
			return { label: "Pioggia forte", icon: "🌧️" };
		case 66:
		case 67:
			return { label: "Pioggia gelata", icon: "🌧️" };
		case 71:
		case 73:
		case 75:
		case 77:
			return { label: "Neve", icon: "❄️" };
		case 80:
		case 81:
		case 82:
			return { label: "Rovesci", icon: "🌦️" };
		case 85:
		case 86:
			return { label: "Rovesci di neve", icon: "🌨️" };
		case 95:
			return { label: "Temporale", icon: "⛈️" };
		case 96:
		case 99:
			return { label: "Temporale con grandine", icon: "⛈️" };
		default:
			return { label: "N/D", icon: "🌡️" };
	}
}

export function toWeather(data: OpenMeteoResponse): Weather {
	const { current, hourly, daily } = data;

	const next: Array<HourlyForecast> = [];
	hourly.time.forEach((time, i) => {
		// Hourly data starts at the current (already begun) hour: keep only future hours.
		if (time <= current.time || next.length >= HOURS_AHEAD) return;
		next.push({
			time,
			temperature: hourly.temperature_2m[i],
			precipitationProbability: hourly.precipitation_probability[i] ?? null,
			condition: describeWeatherCode(hourly.weather_code[i], hourly.is_day[i] === 1),
		});
	});

	return {
		time: current.time,
		temperature: current.temperature_2m,
		apparentTemperature: current.apparent_temperature,
		humidity: current.relative_humidity_2m,
		windSpeed: current.wind_speed_10m,
		condition: describeWeatherCode(current.weather_code, current.is_day === 1),
		min: daily.temperature_2m_min[0],
		max: daily.temperature_2m_max[0],
		hourly: next,
	};
}

export async function getWeather(): Promise<Weather> {
	const params = new URLSearchParams({
		latitude: String(LATITUDE),
		longitude: String(LONGITUDE),
		current:
			"temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
		hourly: "temperature_2m,precipitation_probability,weather_code,is_day",
		forecast_hours: String(HOURS_AHEAD + 1),
		daily: "temperature_2m_max,temperature_2m_min",
		forecast_days: "1",
		timezone: "Europe/Rome",
	});
	const res = await fetch(`${API}?${params}`);
	if (!res.ok) {
		throw new Error(`weather: HTTP ${res.status}`);
	}
	return toWeather((await res.json()) as OpenMeteoResponse);
}
