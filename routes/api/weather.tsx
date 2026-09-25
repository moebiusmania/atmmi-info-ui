import { define } from "@/utils.ts";
import { getWeather } from "@/lib/data/weather.ts";

export const handler = define.handlers({
	async GET() {
		const json = await getWeather();
		return Response.json(json);
	},
});
