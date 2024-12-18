import { bench } from "vitest";
import { Segtree } from "@/segtree";

describe("SegtreeBenchmark", () => {
	const n = 100;
	{
		const op = (a: bigint, b: bigint) => a + b;
		const init = 99n;
		const seg1 = new Segtree(op, () => init, n);
		const seg2 = new Segtree(op, () => init, n, {
			arr: BigUint64Array,
		});
		bench("Bigint", () => {
			for (let i = 0; i < n; i++) seg1.set(i, BigInt(i));

			const x = seg1.all_prod();
		});

		bench("U64", () => {
			for (let i = 0; i < n; i++) seg2.set(i, BigInt(i));

			const x = seg2.all_prod();
		});
	}

	{
		const op = (a: number, b: number) => a + b;
		const init = 99;
		const seg1 = new Segtree(op, () => init, n);
		const seg2 = new Segtree(op, () => init, n, {
			arr: Uint32Array,
		});
		const seg3 = new Segtree(op, () => init, n, {
			arr: Uint16Array,
		});
		const seg4 = new Segtree(op, () => init, n, {
			arr: Uint8Array,
		});
		bench("Number", () => {
			for (let i = 0; i < n; i++) seg1.set(i, i);

			const x = seg1.all_prod();
		});

		bench("Uint32", () => {
			for (let i = 0; i < n; i++) seg2.set(i, i);

			const x = seg2.all_prod();
		});
		bench("Uint16", () => {
			for (let i = 0; i < n; i++) seg3.set(i, i);

			const x = seg3.all_prod();
		});
		bench("Uint8", () => {
			for (let i = 0; i < n; i++) seg4.set(i, i);

			const x = seg4.all_prod();
		});
	}
});
