import { Window } from "happy-dom";

import { getPage } from "@/lib/atm_fetch.ts";
import { getContent, getLine, getRows } from "@/lib/parser.ts";
import type { ScrapedLineStatus } from "@/types/line.ts";

export async function getV1Statuses(): Promise<Array<ScrapedLineStatus>> {
	const data = await getPage();
	const window = new Window();
	window.document.write(data);
	const { document } = window;
	const rows = getRows(document as unknown as Document);

	return rows.map((row) => ({
		line: getLine(row),
		text: getContent(row, ".StatusLinee_StatoScritta"),
		status: getContent(row, ".StatusLinee_StatoScritta"),
	}));
}
