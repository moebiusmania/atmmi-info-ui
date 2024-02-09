import jsdom from "jsdom";

import type { News } from "~/types/news";

const { JSDOM } = jsdom;

/**
 * Extracts the news from the HTML page
 */
export const parseNews = async (
  selector: string,
  data: string
): Promise<Array<News>> => {
  const { document } = new JSDOM(data).window;

  const items: Array<Element> = [...document.querySelectorAll(selector)];
  const json: Array<News> = items.map((item: Element) => ({
    url: item.getAttribute("href") || "",
    text: item.textContent?.trim() || "",
  }));

  return json;
};

/**
 * Based on the HTML id of the element, it extract the label of the metro line (M1, M2, etc..)
 */
export const getLine = (row: Element, selector: string = "img"): string => {
  const element: Element = row.querySelector(selector) as Element;
  // @ts-ignore
  return element?.getAttribute("title") || "";
};

/**
 * Extracts the content from the HTML table cells
 */
export const getContent = (row: Element, selector: string): string => {
  const text = row.querySelector(selector)?.textContent || "";
  return text.trim();
};

/**
 * Find the HTML table rows of the metro lines status and filters out only the rows
 * with actual data
 */
export const getRows = (document: Document): Array<Element> => {
  const trs: NodeListOf<Element> = document.querySelectorAll("#StatusLinee tr");

  return [...trs].filter(
    (e) =>
      // @ts-ignore
      e.textContent.trim().length > 0 &&
      e.querySelectorAll(".StatusLinee_mex").length === 0 &&
      !e.id
  );
};
