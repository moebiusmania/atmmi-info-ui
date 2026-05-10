import { define } from "@/utils.ts";

type Schema = {
	status: string;
	now: string;
	routes: string[];
};

export const handler = define.handlers({
	GET() {
		const body: Schema = {
			status: "Up & running",
			now: new Date().toISOString(),
			routes: ["/traffic", "/v1/status", "/news", "/surface"],
		};
		return Response.json(body);
	},
});
