import jsdom from "jsdom";

import { getPage } from "../endpoint";
import type { LineStatus } from "../../types/line";

const { JSDOM } = jsdom;

/**
 * Based on the HTML id of the element, it extract the label of the metro line (M1, M2, etc..)
 */
const getLine = (
  row: Element,
  selector: string = "div.StatusLinee_Stretch span"
): string => {
  const element: Element = row.querySelector(selector);
  return element.id.match(/([M][0-9])\w/g)[0].replace("_", "");
};

/**
 * Extracts the content from the HTML table cells
 */
const getContent = (row: Element, selector: string): string =>
  row.querySelector(selector).textContent.trim();

/**
 * Find the HTML table rows of the metro lines status and filters out only the rows
 * with actual data
 */
const getRows = (document): Array<Element> => {
  const trs: NodeListOf<Element> = document.querySelectorAll("#StatusLinee tr");
  return [...trs].filter(
    (e) =>
      e.textContent.trim().length > 0 &&
      e.querySelectorAll(".StatusLinee_mex").length === 0
  );
};

export default defineEventHandler(async (): Promise<Array<LineStatus>> => {
  const data = await getPage();
  const { document } = new JSDOM(data).window;
  const rows: Array<Element> = getRows(document);

  const json: Array<LineStatus> = rows.map((row, index) => {
    return {
      line: getLine(row),
      text: getContent(row, "div.StatusLinee_DirezioneScritta"),
      status: getContent(row, "div.StatusLinee_Stretch span"),
    };
  });

  return json;
});
