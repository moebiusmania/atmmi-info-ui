// Service worker: makes the app installable and shows the last loaded dashboard when offline.
// Bump CACHE to drop old entries after changing the caching strategy.
const CACHE = "atmmi-v1";

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
			)
			.then(() => self.clients.claim()),
	);
});

function store(request, response) {
	if (response.ok) {
		const copy = response.clone();
		caches.open(CACHE).then((cache) => cache.put(request, copy));
	}
	return response;
}

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;
	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	if (request.mode === "navigate") {
		// Network first: always show fresh data, fall back to the last copy when offline.
		event.respondWith(
			fetch(request)
				.then((response) => store(request, response))
				.catch(() => caches.match(request).then((cached) => cached ?? caches.match("/"))),
		);
		return;
	}

	if (url.pathname.startsWith("/assets/") || /\.(png|svg|webmanifest)$/.test(url.pathname)) {
		// Hashed build assets and icons: cache first.
		event.respondWith(
			caches.match(request).then((cached) =>
				cached ?? fetch(request).then((response) => store(request, response))
			),
		);
	}
});
