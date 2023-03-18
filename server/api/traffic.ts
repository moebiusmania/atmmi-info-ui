import jsdom from "jsdom";

import { getPage } from "../endpoint";
import type { News } from "../../types/news";

const { JSDOM } = jsdom;

const selector: string =
  "#cbqwp_ctl00_SPWebPartManager1_g_c8e995f5_72a5_4f90_88dd_ae34a9352dfa div.news-item a";

export default defineEventHandler(async (): Promise<Array<News>> => {
  const data = await getPage();
  const { document } = new JSDOM(data).window;
  const items: Array<Element> = [...document.querySelectorAll(selector)];
  const json: Array<News> = items.map((item: Element) => ({
    url: item.getAttribute("href") || "",
    text: item.textContent?.trim() || "",
  }));
  return json;
});
