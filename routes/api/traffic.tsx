import { define } from "@/utils.ts";
import { getTrafficNews } from "@/lib/data/traffic.ts";

export const handler = define.handlers({
	async GET() {
		const json = await getTrafficNews();
		return Response.json(json);
	},
});
