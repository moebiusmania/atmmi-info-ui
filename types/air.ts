export type Pollutant = "pm10" | "pm25" | "no2" | "o3";

/** European Air Quality Index bands */
export type AirQualityLevel =
	| "good"
	| "fair"
	| "moderate"
	| "poor"
	| "very-poor"
	| "extremely-poor";

export type PollutantReading = {
	pollutant: Pollutant;
	/** Average across Milan stations, µg/m³ */
	value: number;
	/** Local time (Europe/Rome) of the measurement, ISO 8601 without offset */
	time: string;
	/** NO2/O3 are hourly values, PM10/PM2.5 daily averages */
	period: "hourly" | "daily";
	level: AirQualityLevel;
	stations: number;
};
