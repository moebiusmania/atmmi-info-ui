import { define } from "@/utils.ts";
import { getAirQuality } from "@/lib/data/air.ts";

export const handler = define.handlers({
	async GET() {
		const json = await getAirQuality();
		return Response.json(json);
	},
});
