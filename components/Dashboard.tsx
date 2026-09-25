import "preact/jsx-runtime";
import type { DashboardData } from "@/lib/dashboard_data.ts";
import { AirQualitySection } from "@/components/AirQualitySection.tsx";
import { NewsSection } from "@/components/NewsSection.tsx";
import { Overview } from "@/components/Overview.tsx";
import { StaticMapSection } from "@/components/StaticMapSection.tsx";
import { StatusV1Section } from "@/components/StatusV1Section.tsx";
import { SurfaceSection } from "@/components/SurfaceSection.tsx";
import { TrafficSection } from "@/components/TrafficSection.tsx";
import { WeatherSection } from "@/components/WeatherSection.tsx";

export interface DashboardProps {
	data: DashboardData;
}

export function Dashboard(props: DashboardProps) {
	const d = props.data;
	return (
		<main class="dashboard">
			<Overview data={d} />
			<div class="dashboard__grid">
				<StatusV1Section items={d.statusV1} error={d.statusV1Error} index={0} />
				<SurfaceSection items={d.surface} error={d.surfaceError} index={1} />
				<WeatherSection weather={d.weather} error={d.weatherError} index={2} />
				<AirQualitySection items={d.air} error={d.airError} index={3} />
				<TrafficSection items={d.traffic} error={d.trafficError} index={4} />
				<NewsSection items={d.news} error={d.newsError} index={5} />
				<StaticMapSection index={6} />
			</div>
		</main>
	);
}
