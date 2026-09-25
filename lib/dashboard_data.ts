import { getAirQuality } from "@/lib/data/air.ts";
import { getAtmNews } from "@/lib/data/news.ts";
import { getSurfaceAlerts } from "@/lib/data/surface.ts";
import { getTrafficNews } from "@/lib/data/traffic.ts";
import { getV1Statuses } from "@/lib/data/status_v1.ts";
import { getWeather } from "@/lib/data/weather.ts";
import type { PollutantReading } from "@/types/air.ts";
import type { ScrapedLineStatus } from "@/types/line.ts";
import type { News } from "@/types/news.ts";
import type { Weather } from "@/types/weather.ts";

export type DashboardData = {
	statusV1: Array<ScrapedLineStatus> | null;
	statusV1Error: string | null;
	surface: Array<string> | null;
	surfaceError: string | null;
	traffic: Array<News> | null;
	trafficError: string | null;
	news: Array<News> | null;
	newsError: string | null;
	weather: Weather | null;
	weatherError: string | null;
	air: Array<PollutantReading> | null;
	airError: string | null;
};

function errMessage(reason: unknown): string {
	return reason instanceof Error ? reason.message : String(reason);
}

export async function loadDashboardData(): Promise<DashboardData> {
	const [v1, surface, traffic, news, weather, air] = await Promise.allSettled([
		getV1Statuses(),
		getSurfaceAlerts(),
		getTrafficNews(),
		getAtmNews(),
		getWeather(),
		getAirQuality(),
	]);

	return {
		statusV1: v1.status === "fulfilled" ? v1.value : null,
		statusV1Error: v1.status === "rejected" ? errMessage(v1.reason) : null,
		surface: surface.status === "fulfilled" ? surface.value : null,
		surfaceError: surface.status === "rejected" ? errMessage(surface.reason) : null,
		traffic: traffic.status === "fulfilled" ? traffic.value : null,
		trafficError: traffic.status === "rejected" ? errMessage(traffic.reason) : null,
		news: news.status === "fulfilled" ? news.value : null,
		newsError: news.status === "rejected" ? errMessage(news.reason) : null,
		weather: weather.status === "fulfilled" ? weather.value : null,
		weatherError: weather.status === "rejected" ? errMessage(weather.reason) : null,
		air: air.status === "fulfilled" ? air.value : null,
		airError: air.status === "rejected" ? errMessage(air.reason) : null,
	};
}
