const WEBSITE = "https://www.atm.it/it/Pagine/default.aspx";
const API = "https://giromilano.atm.it/proxy.tpportal/api/tpPortal/tpl/atm";

const tlsClient = Deno.createHttpClient(
	{
		// Deno: permissive TLS for legacy ATM / giromilano certificates (see README).
		tlsOptions: { insecure: true },
	} as Parameters<typeof Deno.createHttpClient>[0],
);

async function readText(res: Response, label: string): Promise<string> {
	if (!res.ok) {
		throw new Error(`${label}: HTTP ${res.status}`);
	}
	return await res.text();
}

async function readJson<T>(res: Response, label: string): Promise<T> {
	if (!res.ok) {
		throw new Error(`${label}: HTTP ${res.status}`);
	}
	return (await res.json()) as T;
}

/**
 * Fetches the ATM homepage HTML. Uses a permissive TLS client because of
 * upstream certificate compatibility (see Nuxt discussion in nuxt/nuxt#21609).
 */
type FetchWithClient = RequestInit & { client: Deno.HttpClient };

export async function getPage(): Promise<string> {
	const res = await fetch(WEBSITE, { client: tlsClient } as FetchWithClient as RequestInit);
	return await readText(res, "getPage");
}

export async function getApi<T = unknown>(resource = ""): Promise<T> {
	const res = await fetch(
		`${API}/${resource}`,
		{ client: tlsClient } as FetchWithClient as RequestInit,
	);
	return await readJson<T>(res, `getApi(${resource})`);
}

export { API, WEBSITE };
