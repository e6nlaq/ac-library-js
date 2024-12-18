import { bench } from "vitest";

// This benchmark is for an array init's test.

describe("Array Init Benchmark", () => {
	const n = 10000000;
	bench("Array fill", () => {
		const arr = new Array(n).fill(1);
	});

	bench("Array for", () => {
		const arr = new Array(n);
		for (let i = 0; i < n; i++) arr[i] = 1;
	});

	bench("Typed fill", () => {
		const arr = new Int32Array(n).fill(1);
	});

	bench("Typed for", () => {
		const arr = new Int32Array(n);
		for (let i = 0; i < n; i++) arr[i] = 1;
	});
});
