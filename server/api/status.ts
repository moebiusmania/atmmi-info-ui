import jsdom from "jsdom";

import { getPage } from "../endpoint";
import type { LineStatus } from "../../types/line";
import { getContent, getLine, getRows } from "../parser";

const { JSDOM } = jsdom;

export default defineEventHandler(async (): Promise<Array<LineStatus>> => {
  const data = await getPage();
  const { document } = new JSDOM(data).window;
  const rows: Array<Element> = getRows(document);

  const json: Array<LineStatus> = rows.map((row) => {
    return {
      line: getLine(row),
      text: getContent(row, ".StatusLinee_StatoScritta"),
      status: getContent(row, ".StatusLinee_StatoScritta"),
    };
  });

  return json;
});
