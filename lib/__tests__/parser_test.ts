import { Window } from "happy-dom";
import { assertEquals } from "@/lib/__tests__/assert.ts";
import { loadingClass, mockLine, mockNews } from "@/lib/dashboard_utils.ts";
import { getContent, getLine, getRows, parseNews } from "@/lib/parser.ts";

function setupDocument() {
	const window = new Window();
	window.document.body.innerHTML = `<p>Hello world</p>`;
	globalThis.document = window.document as unknown as Document;
}

const domTest = (name: string, fn: () => void) =>
	Deno.test({
		name,
		sanitizeOps: false,
		sanitizeResources: false,
		fn,
	});

domTest("parseNews()", () => {
	setupDocument();
	const data = `
    <div class="news-item">
      <a href="https://example.com">Example</a>
    </div>
    <div class="news-item">
      <a href="https://example.com">Example</a>
    </div>
  `;

	const json = parseNews(".news-item a", data);

	assertEquals(json, [
		{ url: "https://example.com", text: "Example" },
		{ url: "https://example.com", text: "Example" },
	]);
});

domTest("getLine()", () => {
	setupDocument();
	const row = document.createElement("div");
	row.innerHTML = `<img title="M1" />`;

	assertEquals(getLine(row), "M1");
});

domTest("getContent()", () => {
	setupDocument();
	const row = document.createElement("div");
	row.innerHTML = `<p class="StatusLinee_StatoScritta">text</p>`;

	assertEquals(getContent(row, ".StatusLinee_StatoScritta"), "text");
});

domTest("getRows()", () => {
	setupDocument();
	const table = document.createElement("table");
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
	assertEquals(rows.length, 2);
	assertEquals(rows[0].textContent?.trim(), "OK");
	assertEquals(rows[1].textContent?.trim(), "KO");
});

Deno.test({
	name: "loadingClass() returns a width utility class",
	sanitizeOps: false,
	sanitizeResources: false,
	fn() {
		const cls = loadingClass();
		const ok = /w-(1\/4|2\/4|3\/4|full)/.test(cls);
		assertEquals(ok, true);
	},
});

Deno.test({
	name: "mockLine() shape",
	sanitizeOps: false,
	sanitizeResources: false,
	fn() {
		const lines = mockLine();
		assertEquals("line" in lines[0], true);
		assertEquals("directions" in lines[0], true);
	},
});

Deno.test({
	name: "mockNews() shape",
	sanitizeOps: false,
	sanitizeResources: false,
	fn() {
		const news = mockNews();
		assertEquals("text" in news[0], true);
		assertEquals("url" in news[0], true);
	},
});
