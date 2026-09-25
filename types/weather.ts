export type WeatherCondition = {
	label: string;
	icon: string;
};

export type HourlyForecast = {
	/** Local time (Europe/Rome), ISO 8601 without offset */
	time: string;
	temperature: number;
	precipitationProbability: number | null;
	condition: WeatherCondition;
};

export type Weather = {
	/** Local time (Europe/Rome), ISO 8601 without offset */
	time: string;
	temperature: number;
	apparentTemperature: number;
	humidity: number;
	windSpeed: number;
	condition: WeatherCondition;
	min: number;
	max: number;
	hourly: Array<HourlyForecast>;
};
