import { Window } from "happy-dom";

import { getPage } from "../../endpoint";
import type { ScrapedLineStatus } from "../../../types/line";
import { getContent, getLine, getRows } from "../../parser";

export default defineEventHandler(
	async (): Promise<Array<ScrapedLineStatus>> => {
		const data = await getPage();
		const window = new Window();
		window.document.write(data);
		const { document } = window;
		const rows: Array<Element> = getRows(document);

		const json: Array<ScrapedLineStatus> = rows.map((row) => {
			return {
				line: getLine(row),
				text: getContent(row, ".StatusLinee_StatoScritta"),
				status: getContent(row, ".StatusLinee_StatoScritta"),
			};
		});

		return json;
	},
);
