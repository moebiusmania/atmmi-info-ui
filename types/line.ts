export interface Direction {
	status: string;
	label: string;
}

/** Metro status from giromilano JSON API (`/api/status`). */
export interface MetroLineStatusV2 {
	line: string;
	directions: Direction[];
}

/** Scraped metro line row from ATM homepage (`/api/v1/status`). */
export type ScrapedLineStatus = {
	line: string;
	text: string;
	status: string;
};
