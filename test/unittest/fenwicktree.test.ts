import { describe, expect, test } from "bun:test";
import { FenwickTree } from "@/fenwicktree";
import { modint, modint998244353 } from "@/modint";
import { max_int, max_ll, min_int, min_ll } from "../utils/limit";

describe("FenwickTreeTest", () => {
	test("Empty", () => {
		const fw_ll = new FenwickTree(BigInt);
		expect(fw_ll.sum(0, 0)).toEqual(0n);

		const fw_modint = new FenwickTree(modint998244353);
		expect(fw_modint.sum(0, 0).val()).toEqual(0);
	});

	test("Assign", () => {
		// biome-ignore lint/style/useConst: <explanation>
		let fw: FenwickTree<number>;
		fw = new FenwickTree(Number, 10);
	});

	test("Zero", () => {
		const fw_ll = new FenwickTree(BigInt, 0);
		expect(fw_ll.sum(0, 0)).toEqual(0n);

		const fw_modint = new FenwickTree(modint998244353, 0);
		expect(fw_modint.sum(0, 0).val()).toEqual(0);
	});

	test("NaiveTest", () => {
		for (let n = 0; n <= 50; n++) {
			const fw = new FenwickTree(BigInt, n);
			for (let i = 0; i < n; i++) {
				fw.add(i, BigInt(i) ** 2n);
			}

			for (let l = 0; l <= n; l++) {
				for (let r = l; r <= n; r++) {
					let sum = 0n;
					for (let i = l; i < r; i++) {
						sum += BigInt(i) ** 2n;
					}
					expect(fw.sum(l, r)).toEqual(sum);
				}
			}
		}
	});

	test("SMintTest", () => {
		const mint = modint(11);
		for (let n = 0; n <= 50; n++) {
			const fw = new FenwickTree(mint, n);
			for (let i = 0; i < n; i++) {
				fw.add(i, mint(i * i));
			}
			for (let l = 0; l <= n; l++) {
				for (let r = l; r <= n; r++) {
					const sum = mint(0);
					for (let i = l; i < r; i++) {
						sum.adda(i * i);
					}
					expect(fw.sum(l, r).val()).toEqual(sum.val());
				}
			}
		}
	});

	test("Invalid", () => {
		expect(() => new FenwickTree(Number, -1)).toThrowError();
		const s = new FenwickTree(Number, 10);

		expect(() => s.add(-1, 0)).toThrowError();
		expect(() => s.add(10, 0)).toThrowError();

		expect(() => s.sum(-1, 3)).toThrowError();
		expect(() => s.sum(3, 11)).toThrowError();
		expect(() => s.sum(5, 3)).toThrowError();
	});

	test("Bound", () => {
		const fw = new FenwickTree(Number, 10);
		fw.add(3, max_int);
		fw.add(5, min_int);

		expect(-1).toEqual(fw.sum(0, 10));
		expect(-1).toEqual(fw.sum(3, 6));
		expect(max_int).toEqual(fw.sum(3, 4));
		expect(min_int).toEqual(fw.sum(4, 10));
	});

	test("Bound", () => {
		const fw = new FenwickTree(BigInt, 10);
		fw.add(3, max_ll);
		fw.add(5, min_ll);

		expect(-1n).toEqual(fw.sum(0, 10));
		expect(-1n).toEqual(fw.sum(3, 6));
		expect(max_ll).toEqual(fw.sum(3, 4));
		expect(min_ll).toEqual(fw.sum(4, 10));
	});
});
