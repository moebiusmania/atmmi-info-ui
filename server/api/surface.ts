import jsdom from "jsdom";

type AlertAPIResponse = {
	id: number;
	deleted: boolean;
	alert_published_date: string;
	alert_title: string;
	alert_text: string;
};

const { JSDOM } = jsdom;

export default defineEventHandler(async (): Promise<Array<string>> => {
	const rnd: number = Math.floor(Math.random() * 1000);
	const data: AlertAPIResponse = await $fetch(
		`https://alert.atm.it/it?${rnd}`,
		{
			mode: "cors",
		},
	);
	const { document } = new JSDOM(data.alert_text).window;
	const items: NodeListOf<Element> = document.querySelectorAll("p");
	const json: Array<string> = [...items]
		.map((e) => e.textContent?.trim() || "")
		.filter((e) => e.length > 0);
	return json;
});
