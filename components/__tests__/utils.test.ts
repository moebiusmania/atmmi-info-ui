import { loadingClass, mockLine, mockNews } from "../utils";

import { describe, expect, test } from "vitest";

describe("utils.ts", () => {
	test("loadingClass()", () => {
		const value = loadingClass();
		expect(value).toMatch(/h-4 bg-gray-400 rounded w-[1-4]/);
	});

	test("mockLine()", () => {
		const value = mockLine();
		expect(value).toHaveLength(10);
	});

	test("mockNews()", () => {
		const value = mockNews();
		expect(value).toHaveLength(10);
	});

	test("loadingClass() returns valid width", () => {
		const value = loadingClass();
		const width = parseInt(value.match(/w-(\d)\/4/)?.[1] || "0", 10);
		expect(width).toBeGreaterThan(0);
		expect(width).toBeLessThanOrEqual(4);
	});

	test("mockLine() returns correct structure", () => {
		const lines = mockLine();
		expect(lines[0]).toHaveProperty("line");
		expect(lines[0]).toHaveProperty("text");
		expect(lines[0]).toHaveProperty("status");
	});
});
