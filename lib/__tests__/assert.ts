export class AssertionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AssertionError";
	}
}

export function assertEquals<T>(actual: T, expected: T, msg?: string): void {
	const actualStr = JSON.stringify(actual);
	const expectedStr = JSON.stringify(expected);
	if (actualStr !== expectedStr) {
		throw new AssertionError(
			msg ?? `Values are not equal.\n  actual: ${actualStr}\n  expected: ${expectedStr}`,
		);
	}
}
