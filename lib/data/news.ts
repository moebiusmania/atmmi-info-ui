import { getPage } from "@/lib/atm_fetch.ts";
import { parseNews } from "@/lib/parser.ts";
import type { News } from "@/types/news.ts";

const selector =
	"#slwp_ctl00_PlaceHolderMain_SummaryLinkFieldControl2_SummaryLinkFieldControl2 > tbody > tr td div.item > div.link-item > a";

export async function getAtmNews(): Promise<Array<News>> {
	const data = await getPage();
	return parseNews(selector, data);
}
