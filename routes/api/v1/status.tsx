import { define } from "@/utils.ts";
import { getV1Statuses } from "@/lib/data/status_v1.ts";

export const handler = define.handlers({
	async GET() {
		const json = await getV1Statuses();
		return Response.json(json);
	},
});
