import { getPage } from "../endpoint";
import type { News } from "../../types/news";
import { parseNews } from "../parser";

const selector: string =
	"#slwp_ctl00_PlaceHolderMain_SummaryLinkFieldControl2_SummaryLinkFieldControl2 > tbody > tr td div.item > div.link-item > a";

export default defineEventHandler(async (): Promise<Array<News>> => {
	const data: string = await getPage();
	const json: Array<News> = await parseNews(selector, data);
	return json;
});
