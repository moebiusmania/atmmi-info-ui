import { define } from "@/utils.ts";
import { getAtmNews } from "@/lib/data/news.ts";

export const handler = define.handlers({
	async GET() {
		const json = await getAtmNews();
		return Response.json(json);
	},
});
