import type { AirQualityLevel, Pollutant, PollutantReading } from "@/types/air.ts";

// ARPA Lombardia "Dati sensori aria" dataset (Socrata API, dati.lombardia.it).
const API = "https://www.dati.lombardia.it/resource/nicp-bhqi.json";

/**
 * Active ARPA sensors in the Comune di Milano, from the "Stazioni qualità dell'aria" dataset
 * (dati.lombardia.it/resource/ib47-atvt.json?comune=Milano). Stations: v.Senato, Verziere,
 * Pascal Città Studi, v.Liguria, v.Marche.
 */
const SENSORS: Record<Pollutant, Array<string>> = {
	no2: ["5551", "5531", "10279", "5542", "5504"],
	o3: ["5725", "10282"],
	pm10: ["10320", "6956", "10273", "20429"],
	pm25: ["17122", "10283", "20529"],
};

const ORDER: Array<Pollutant> = ["pm10", "pm25", "no2", "o3"];

/**
 * European Air Quality Index upper bounds (µg/m³) for good → very poor; anything above the last
 * bound is "extremely poor". See https://airindex.eea.europa.eu/AQI/index.html
 */
const EAQI_BANDS: Record<Pollutant, [number, number, number, number, number]> = {
	pm25: [5, 15, 50, 90, 140],
	pm10: [15, 45, 120, 195, 270],
	no2: [10, 25, 60, 100, 150],
	o3: [60, 100, 120, 160, 180],
};

const LEVELS: Array<AirQualityLevel> = [
	"good",
	"fair",
	"moderate",
	"poor",
	"very-poor",
	"extremely-poor",
];

export type ArpaRow = {
	idsensore: string;
	data: string;
	valore: string;
	stato: string;
};

export function aqiLevel(pollutant: Pollutant, value: number): AirQualityLevel {
	const index = EAQI_BANDS[pollutant].findIndex((max) => value <= max);
	return LEVELS[index === -1 ? LEVELS.length - 1 : index];
}

/**
 * For each pollutant, averages the valid readings of all its sensors at the most recent
 * timestamp available. Pollutants with no valid readings are omitted.
 */
export function summarizeReadings(rows: Array<ArpaRow>): Array<PollutantReading> {
	const readings: Array<PollutantReading> = [];

	for (const pollutant of ORDER) {
		const sensors = SENSORS[pollutant];
		// ARPA marks missing/invalid values with stato "NA" and valore -9999.
		const valid = rows.filter((row) =>
			sensors.includes(row.idsensore) && row.stato === "VA" && Number(row.valore) >= 0
		);
		if (valid.length === 0) continue;

		const latest = valid.reduce((max, row) => (row.data > max ? row.data : max), valid[0].data);
		const values = valid.filter((row) => row.data === latest).map((row) => Number(row.valore));
		const value = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

		readings.push({
			pollutant,
			value,
			time: latest,
			period: pollutant === "pm10" || pollutant === "pm25" ? "daily" : "hourly",
			level: aqiLevel(pollutant, value),
			stations: values.length,
		});
	}

	return readings;
}

export async function getAirQuality(): Promise<Array<PollutantReading>> {
	// PM values are published once a day for the previous day: look back a few days.
	const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19);
	const ids = Object.values(SENSORS).flat().map((id) => `'${id}'`).join(",");
	const params = new URLSearchParams({
		$select: "idsensore,data,valore,stato",
		$where: `idsensore in (${ids}) AND data >= '${since}'`,
		$order: "data DESC",
		$limit: "2000",
	});
	const res = await fetch(`${API}?${params}`);
	if (!res.ok) {
		throw new Error(`air: HTTP ${res.status}`);
	}
	return summarizeReadings((await res.json()) as Array<ArpaRow>);
}
