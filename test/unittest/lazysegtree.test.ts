import { describe, expect, test } from "bun:test";
import { LazySegtree } from "@/lazysegtree";

const starry = {
	op_ss: (a: number, b: number) => Math.max(a, b),
	op_ts: (a: number, b: number) => a + b,
	op_tt: (a: number, b: number) => a + b,
	e_s: () => -1000000000,
	e_t: () => 0,
};

const starry_seg = (x?: number | number[]) =>
	new LazySegtree<number, number>(
		starry.op_ss,
		starry.e_s,
		starry.op_ts,
		starry.op_tt,
		starry.e_t,
		x
	);

describe("LazySegtreeTest", () => {
	const e = -1000000000;
	test("Zero", () => {
		{
			const s = starry_seg(0);
			expect(e).toEqual(s.all_prod());
		}
		{
			const s = starry_seg();
			expect(e).toEqual(s.all_prod());
		}
		{
			const s = starry_seg(10);
			expect(e).toEqual(s.all_prod());
		}
	});

	test("Assign", () => {
		// biome-ignore lint/style/useConst: <explanation>
		let seg0: LazySegtree<number, number>;
		seg0 = starry_seg(10);
	});

	test("Invalid", () => {
		expect(() => {
			const s = starry_seg(-1);
		}).toThrowError();
		const s = starry_seg(10);

		expect(() => s.get(-1)).toThrowError();
		expect(() => s.get(10)).toThrowError();

		expect(() => s.prod(-1, -1)).toThrowError();
		expect(() => s.prod(3, 2)).toThrowError();
		expect(() => s.prod(0, 11)).toThrowError();
		expect(() => s.prod(-1, 11)).toThrowError();
	});

	test("NaiveProd", () => {
		for (let n = 0; n <= 50; n++) {
			const seg = starry_seg(n);
			const p = new Int32Array(n);
			for (let i = 0; i < n; i++) {
				p[i] = (i * i + 100) % 31;
				seg.set(i, p[i]);
			}
			for (let l = 0; l <= n; l++) {
				for (let r = l; r <= n; r++) {
					let e = -1000000000;
					for (let i = l; i < r; i++) {
						e = Math.max(e, p[i]);
					}
					expect(seg.prod(l, r)).toEqual(e);
				}
			}
		}
	});

	test("Usage", () => {
		const seg = starry_seg(new Array<number>(10).fill(0));
		expect(seg.all_prod()).toEqual(0);
		seg.apply(0, 3, 5);
		expect(seg.all_prod()).toEqual(5);
		seg.apply(2, -10);
		expect(seg.prod(2, 3)).toEqual(-5);
		expect(seg.prod(2, 4)).toEqual(0);
	});

	test("UsageInt32Array", () => {
		const seg = new LazySegtree<number, number>(
			starry.op_ss,
			starry.e_s,
			starry.op_ts,
			starry.op_tt,
			starry.e_t,
			new Int32Array(10)
		);
		expect(seg.all_prod()).toEqual(0);
		seg.apply(0, 3, 5);
		expect(seg.all_prod()).toEqual(5);
		seg.apply(2, -10);
		expect(seg.prod(2, 3)).toEqual(-5);
		expect(seg.prod(2, 4)).toEqual(0);
	});
});
