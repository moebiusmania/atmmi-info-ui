import jsdom from "jsdom";

import { getPage } from "../endpoint";
import type { LineStatus } from "../../types/line";

const { JSDOM } = jsdom;

/**
 * Based on the HTML id of the element, it extract the label of the metro line (M1, M2, etc..)
 */
const getLine = (
  row: Element,
  selector: string = "img"
): string => {
  const element: Element = row.querySelector(selector) as Element;
  // @ts-ignore
  return element.getAttribute("title");
};

/**
 * Extracts the content from the HTML table cells
 */
const getContent = (row: Element, selector: string): string => {
  const text = row.querySelector(selector)?.textContent || ""
  return text.trim()
}

/**
 * Find the HTML table rows of the metro lines status and filters out only the rows
 * with actual data
 */
const getRows = (document: Document): Array<Element> => {
  const trs: NodeListOf<Element> = document.querySelectorAll("#StatusLinee tr");
  
  return [...trs].filter(
    (e) =>
      // @ts-ignore
      e.textContent.trim().length > 0 &&
      e.querySelectorAll(".StatusLinee_mex").length === 0
  );
};

export default defineEventHandler(async (): Promise<Array<LineStatus>> => {
  const data = await getPage();
  const { document } = new JSDOM(data).window;
  const rows: Array<Element> = getRows(document);

  console.log("----trs", rows)

  const json: Array<LineStatus> = rows.map((row, index) => {
    return {
      line: getLine(row),
      text: getContent(row, ".StatusLinee_StatoScritta"),
      status: getContent(row, ".StatusLinee_StatoScritta"),
    };
  });

  return json;
});
