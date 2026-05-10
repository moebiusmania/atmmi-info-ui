import type { MetroLineStatusV2 } from "@/types/line.ts";
import type { News } from "@/types/news.ts";

const WIDTHS = ["w-1/4", "w-2/4", "w-3/4", "w-full"] as const;

export function loadingClass(): string {
	const value = Math.ceil(Math.random() * WIDTHS.length);
	return `h-4 bg-gray-400 rounded ${WIDTHS[value - 1]}`;
}

export function mockLine(): Array<MetroLineStatusV2> {
	return Array(10).fill({
		line: "foo",
		directions: [{ label: "bar", status: "pippo" }],
	});
}

export function mockNews(): Array<News> {
	return Array(10).fill({
		text: "foo",
		url: "bar",
	});
}
