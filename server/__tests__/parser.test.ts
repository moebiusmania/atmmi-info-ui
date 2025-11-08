import jsdom from "jsdom";
import { beforeAll, describe, expect, test } from "vitest";

import { parseNews, getLine, getRows, getContent } from "../parser";
import { loadingClass, mockLine } from "../../components/utils";

const { JSDOM } = jsdom;

describe("parser.ts", () => {
	beforeAll(() => {
		// create a fake document with jsdom
		const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
		global.document = dom.window.document;
	});

	test("parseNews()", async () => {
		const data: string = `
    <div class="news-item">
      <a href="https://example.com">Example</a>
    </div>
    <div class="news-item">
      <a href="https://example.com">Example</a>
    </div>
  `;

		const json = await parseNews(".news-item a", data);

		expect(json).toEqual([
			{ url: "https://example.com", text: "Example" },
			{ url: "https://example.com", text: "Example" },
		]);
	});

	test("getLine()", () => {
		const row: Element = document.createElement("div");
		row.innerHTML = `<img title="M1" />`;

		expect(getLine(row)).toBe("M1");
	});

	test("getContent()", () => {
		const row: Element = document.createElement("div");
		row.innerHTML = `<p class="StatusLinee_StatoScritta">text</p>`;

		expect(getContent(row, ".StatusLinee_StatoScritta")).toBe("text");
	});

	test("getRows()", () => {
		const table: Element = document.createElement("table");
		table.id = "StatusLinee";
		table.innerHTML = `
      <tr>
        <td class="StatusLinee_StatoScritta">OK</td>
      </tr>
      <tr>
        <td class="StatusLinee_StatoScritta">KO</td>
      </tr>
    `;

		document.body.appendChild(table);

		const rows = getRows(document);
		expect(rows.length).toBe(2);
		expect(rows[0].textContent?.trim()).toBe("OK");
		expect(rows[1].textContent?.trim()).toBe("KO");
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
