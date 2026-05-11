import "preact/jsx-runtime";
import type { DashboardData } from "@/lib/dashboard_data.ts";
import { NewsSection } from "@/components/NewsSection.tsx";
import { StaticMapSection } from "@/components/StaticMapSection.tsx";
import { StatusV1Section } from "@/components/StatusV1Section.tsx";
import { SurfaceSection } from "@/components/SurfaceSection.tsx";
import { TrafficSection } from "@/components/TrafficSection.tsx";

export interface DashboardProps {
	data: DashboardData;
}

export function Dashboard(props: DashboardProps) {
	const d = props.data;
	return (
		<main class="dashboard">
			<div class="dashboard__item">
				<StatusV1Section items={d.statusV1} error={d.statusV1Error} />
			</div>
			<div class="dashboard__item">
				<SurfaceSection items={d.surface} error={d.surfaceError} />
			</div>
			<div class="dashboard__item">
				<TrafficSection items={d.traffic} error={d.trafficError} />
			</div>
			<div class="dashboard__item">
				<NewsSection items={d.news} error={d.newsError} />
			</div>
			<div class="dashboard__item">
				<StaticMapSection />
			</div>
		</main>
	);
}
