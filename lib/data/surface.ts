import { Window } from "happy-dom";

type AlertAPIResponse = {
	id: number;
	deleted: boolean;
	alert_published_date: string;
	alert_title: string;
	alert_text: string;
};

export async function getSurfaceAlerts(): Promise<Array<string>> {
	const rnd = Math.floor(Math.random() * 1000);
	const res = await fetch(`https://alert.atm.it/it?${rnd}`);
	if (!res.ok) {
		throw new Error(`surface: HTTP ${res.status}`);
	}
	const data = (await res.json()) as AlertAPIResponse;

	const window = new Window();
	window.document.body.innerHTML = data.alert_text;
	const { document } = window;
	const items = [...document.querySelectorAll("p")];
	return items
		.map((e) => e.textContent?.trim() || "")
		.filter((e) => e.length > 0);
}
