import "preact/jsx-runtime";
import type { DashboardData } from "@/lib/dashboard_data.ts";
import { NewsSection } from "@/components/NewsSection.tsx";
import { StaticMapSection } from "@/components/StaticMapSection.tsx";
import { StatusV1Section } from "@/components/StatusV1Section.tsx";
import { SurfaceSection } from "@/components/SurfaceSection.tsx";
import { TrafficSection } from "@/components/TrafficSection.tsx";

const itemStyle = "mb-5 break-inside-avoid";

export interface DashboardProps {
	data: DashboardData;
}

export function Dashboard(props: DashboardProps) {
	const d = props.data;
	return (
		<main class="container mx-auto my-4 px-4 py-2 columns-1 md:columns-2 xl:columns-3 gap-5">
			<div class={itemStyle}>
				<StatusV1Section items={d.statusV1} error={d.statusV1Error} />
			</div>
			<div class={itemStyle}>
				<SurfaceSection items={d.surface} error={d.surfaceError} />
			</div>
			<div class={itemStyle}>
				<TrafficSection items={d.traffic} error={d.trafficError} />
			</div>
			<div class={itemStyle}>
				<NewsSection items={d.news} error={d.newsError} />
			</div>
			<div class={itemStyle}>
				<StaticMapSection />
			</div>
		</main>
	);
}
