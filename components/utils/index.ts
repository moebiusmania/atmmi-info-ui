import type { LineStatus } from "../../types/line";
import type { News } from "../../types/news";

export const loadingClass = (): string => {
	const value: number = Math.ceil(Math.random() * 4);
	return `h-4 bg-gray-400 rounded w-${value}/4`;
};

export const mockLine = (): Array<LineStatus> =>
	Array(10).fill({
		line: "foo",
		text: "bar",
		status: "pippo",
	});

export const mockNews = (): Array<News> =>
	Array(10).fill({
		text: "foo",
		url: "bar",
	});
