import { assertEquals } from "@/lib/__tests__/assert.ts";
import { aqiLevel, type ArpaRow, summarizeReadings } from "@/lib/data/air.ts";
import { describeWeatherCode, type OpenMeteoResponse, toWeather } from "@/lib/data/weather.ts";

Deno.test("describeWeatherCode() maps WMO codes and day/night", () => {
	assertEquals(describeWeatherCode(0, true), { label: "Sereno", icon: "☀️" });
	assertEquals(describeWeatherCode(0, false), { label: "Sereno", icon: "🌙" });
	assertEquals(describeWeatherCode(95).label, "Temporale");
	assertEquals(describeWeatherCode(12345).label, "N/D");
});

Deno.test("toWeather() keeps only future hours", () => {
	const data: OpenMeteoResponse = {
		current: {
			time: "2026-09-25T17:45",
			temperature_2m: 22.7,
			apparent_temperature: 22.8,
			relative_humidity_2m: 52,
			weather_code: 2,
			wind_speed_10m: 4.5,
			is_day: 1,
		},
		hourly: {
			time: ["2026-09-25T17:00", "2026-09-25T18:00", "2026-09-25T19:00"],
			temperature_2m: [22.8, 22.6, 21.9],
			precipitation_probability: [0, 10, null],
			weather_code: [2, 2, 0],
			is_day: [1, 1, 0],
		},
		daily: { temperature_2m_max: [22.9], temperature_2m_min: [16.9] },
	};

	const weather = toWeather(data);
	assertEquals(weather.condition.label, "Parzialmente nuvoloso");
	assertEquals(weather.min, 16.9);
	assertEquals(weather.hourly.map((h) => h.time), ["2026-09-25T18:00", "2026-09-25T19:00"]);
	assertEquals(weather.hourly.map((h) => h.precipitationProbability), [10, null]);
	assertEquals(weather.hourly[1].condition.icon, "🌙");
});

Deno.test("aqiLevel() uses inclusive EAQI upper bounds", () => {
	assertEquals(aqiLevel("pm10", 15), "good");
	assertEquals(aqiLevel("pm10", 16), "fair");
	assertEquals(aqiLevel("pm25", 50), "moderate");
	assertEquals(aqiLevel("no2", 101), "very-poor");
	assertEquals(aqiLevel("o3", 181), "extremely-poor");
});

Deno.test("summarizeReadings() averages the latest valid readings per pollutant", () => {
	const row = (idsensore: string, data: string, valore: string, stato = "VA"): ArpaRow => ({
		idsensore,
		data,
		valore,
		stato,
	});
	const rows = [
		// NO2: latest hour has two valid sensors and one missing value
		row("5551", "2026-09-25T16:00:00.000", "12"),
		row("5531", "2026-09-25T16:00:00.000", "13"),
		row("10279", "2026-09-25T16:00:00.000", "-9999", "NA"),
		row("5551", "2026-09-25T15:00:00.000", "40"),
		// PM10: daily value
		row("10320", "2026-09-24T00:00:00.000", "27"),
		// unknown sensor is ignored
		row("99999", "2026-09-25T16:00:00.000", "500"),
	];

	assertEquals(summarizeReadings(rows), [
		{
			pollutant: "pm10",
			value: 27,
			time: "2026-09-24T00:00:00.000",
			period: "daily",
			level: "fair",
			stations: 1,
		},
		{
			pollutant: "no2",
			value: 13,
			time: "2026-09-25T16:00:00.000",
			period: "hourly",
			level: "fair",
			stations: 2,
		},
	]);
});
