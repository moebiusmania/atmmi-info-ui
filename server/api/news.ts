import jsdom from "jsdom";

import { getPage } from "../endpoint";
import type { News } from "../../types/news";

const { JSDOM } = jsdom;

const selector: string =
  "#slwp_ctl00_PlaceHolderMain_SummaryLinkFieldControl2_SummaryLinkFieldControl2 > tbody > tr td div.item > div.link-item > a";

export default defineEventHandler(async (): Promise<Array<News>> => {
  const data: string = await getPage();
  const { document } = new JSDOM(data).window;
  const items: Array<Element> = [...document.querySelectorAll(selector)];
  const json: Array<News> = items.map((item: Element) => ({
    url: item.getAttribute("href") || "",
    text: item.textContent?.trim() || "",
  }));
  return json;
});
