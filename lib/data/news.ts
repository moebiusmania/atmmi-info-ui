import { getPage, WEBSITE } from "@/lib/atm_fetch.ts";
import { parseNews } from "@/lib/parser.ts";
import type { News } from "@/types/news.ts";

const selector =
	"#slwp_ctl00_PlaceHolderMain_SummaryLinkFieldControl2_SummaryLinkFieldControl2 > tbody > tr td div.item > div.link-item > a";

export async function getAtmNews(): Promise<Array<News>> {
	const data = await getPage();
	// Some links on the ATM homepage are relative (e.g. "/it/AtmNews/...").
	return parseNews(selector, data).map((item) => ({
		...item,
		url: new URL(item.url, WEBSITE).href,
	}));
}
