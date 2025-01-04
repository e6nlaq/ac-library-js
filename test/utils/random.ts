import { ok } from "node:assert";
import { faker } from "@faker-js/faker";

export function randint(a: number, b: number): number;
export function randint(a: bigint, b: bigint): bigint;

export function randint(
	a: number | bigint,
	b: number | bigint
): number | bigint {
	if (typeof a === "number" && typeof b === "number")
		return faker.number.int({ min: a, max: b });
	return faker.number.bigInt({ min: a, max: b });
}

export const randbool = faker.datatype.boolean;

export function randpair(lower: number, upper: number): [number, number];
export function randpair(lower: bigint, upper: bigint): [bigint, bigint];

export function randpair(
	lower: number | bigint,
	upper: number | bigint
): [number | bigint, number | bigint] {
	if (typeof lower === "number" && typeof upper === "number") {
		ok(lower - upper >= 1);

		let a: number;
		let b: number;
		do {
			a = randint(lower, upper);
			b = randint(lower, upper);
		} while (a === b);

		if (a > b) [a, b] = [b, a];
		return [a, b];
	}
	if (typeof lower === "bigint" && typeof upper === "bigint") {
		ok(lower - upper >= 1n);
		let a: bigint;
		let b: bigint;
		do {
			a = randint(lower, upper);
			b = randint(lower, upper);
		} while (a === b);

		if (a > b) [a, b] = [b, a];
		return [a, b];
	}

	throw new TypeError();
}
