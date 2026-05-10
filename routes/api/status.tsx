import { define } from "@/utils.ts";
import { getV2Statuses } from "@/lib/data/status_v2.ts";

export const handler = define.handlers({
	async GET() {
		const json = await getV2Statuses();
		return Response.json(json);
	},
});
