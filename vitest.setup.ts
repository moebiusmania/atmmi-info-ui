const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
	const msg = typeof args[0] === "string" ? args[0] : String(args[0]);
	if (
		msg.includes("setup function returned a promise") ||
		msg.includes("no <Suspense> boundary") ||
		msg.includes("Failed to resolve component") ||
		(msg.includes("Suspense") && msg.includes("experimental"))
	) {
		return;
	}
	originalWarn.apply(console, args);
};
