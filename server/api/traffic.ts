import { getPage } from "../endpoint";
import type { News } from "../../types/news";
import { parseNews } from "../parser";

const selector: string =
	"#cbqwp_ctl00_SPWebPartManager1_g_c8e995f5_72a5_4f90_88dd_ae34a9352dfa div.news-item a";

export default defineEventHandler(async (): Promise<Array<News>> => {
	const data: string = await getPage();
	const json: Array<News> = await parseNews(selector, data);
	return json;
});
