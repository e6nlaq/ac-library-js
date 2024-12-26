import { bench } from "vitest";
import { Segtree } from "@/segtree";

describe("SegtreeBenchmark", () => {
	const n = 100;
	{
		const op = (a: bigint, b: bigint) => a + b;
		const init = 99n;
		const seg1 = new Segtree(op, () => init, n);

		bench("Bigint", () => {
			for (let i = 0; i < n; i++) seg1.set(i, BigInt(i));

			const x = seg1.all_prod();
		});
	}

	{
		const op = (a: number, b: number) => a + b;
		const init = 99;
		const seg1 = new Segtree(op, () => init, n);

		bench("Number", () => {
			for (let i = 0; i < n; i++) seg1.set(i, i);

			const x = seg1.all_prod();
		});
	}
});
