import { define } from "@/utils.ts";
import { getSurfaceAlerts } from "@/lib/data/surface.ts";

export const handler = define.handlers({
	async GET() {
		const json = await getSurfaceAlerts();
		return Response.json(json);
	},
});
