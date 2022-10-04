import jsdom from "jsdom";

import ENDPOINT from "../endpoint";
import type { LineStatus } from "../../types/line";

const { JSDOM } = jsdom;

const getLine = (
  row: Element,
  selector: string = "div.StatusLinee_Stretch span"
): string => {
  const element: Element = row.querySelector(selector);
  return element.id.match(/([M][0-9])\w/g)[0].replace("_", "");
};

const getContent = (row: Element, selector: string): string =>
  row.querySelector(selector).textContent.trim();

const getRows = (document): Element[] => {
  const trs: NodeListOf<Element> = document.querySelectorAll("#StatusLinee tr");
  return [...trs].filter((e) => e.textContent.trim().length > 0);
};

export default defineEventHandler(async (): Promise<LineStatus[]> => {
  const data = await $fetch(ENDPOINT, {
    method: "GET",
    mode: "cors",
  });
  const { document } = new JSDOM(data).window;
  const rows: Element[] = getRows(document);

  const json: LineStatus[] = rows.map((row, index) => {
    return {
      line: getLine(row),
      text: getContent(row, "div.StatusLinee_DirezioneScritta"),
      status: getContent(row, "div.StatusLinee_Stretch span"),
    };
  });

  return json;
});
