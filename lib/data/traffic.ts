import { getPage } from "@/lib/atm_fetch.ts";
import { parseNews } from "@/lib/parser.ts";
import type { News } from "@/types/news.ts";

const selector =
	"#cbqwp_ctl00_SPWebPartManager1_g_c8e995f5_72a5_4f90_88dd_ae34a9352dfa div.news-item a";

export async function getTrafficNews(): Promise<Array<News>> {
	const data = await getPage();
	return parseNews(selector, data);
}
