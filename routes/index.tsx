import "preact/jsx-runtime";
import { define } from "@/utils.ts";
import { Dashboard } from "@/components/Dashboard.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import { loadDashboardData } from "@/lib/dashboard_data.ts";

export default define.page(async () => {
	const data = await loadDashboardData();

	return (
		<div class="bg-gray-50 min-h-screen">
			<Header />
			<Dashboard data={data} />
			<Footer />
		</div>
	);
});
