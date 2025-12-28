import { Window } from "happy-dom";

type AlertAPIResponse = {
	id: number;
	deleted: boolean;
	alert_published_date: string;
	alert_title: string;
	alert_text: string;
};

export default defineEventHandler(async (): Promise<Array<string>> => {
	const rnd: number = Math.floor(Math.random() * 1000);
	const data: AlertAPIResponse = await $fetch(
		`https://alert.atm.it/it?${rnd}`,
		{
			mode: "cors",
		},
	);
	const window = new Window();
	window.document.body.innerHTML = data.alert_text;
	const { document } = window;
	const items: NodeListOf<Element> = document.querySelectorAll("p");
	const json: Array<string> = [...items]
		.map((e) => e.textContent?.trim() || "")
		.filter((e) => e.length > 0);
	return json;
});
