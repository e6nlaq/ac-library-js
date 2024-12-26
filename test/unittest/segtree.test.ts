import { describe, expect, test } from "bun:test";
import {
	Segtree,
	type OperatorType,
	type ElementType,
	type SearchFunction,
} from "@/segtree";
import { ok } from "node:assert";

class SegtreeNaive<S extends string> {
	private n: number;
	private d: S[];
	private op: OperatorType<S>;
	private e: ElementType<S>;

	constructor(op: OperatorType<S>, e: ElementType<S>, _n: number) {
		this.op = op;
		this.e = e;

		this.n = _n;
		this.d = new Array(this.n).fill(e());
	}

	set(p: number, x: S) {
		this.d[p] = x;
	}

	get(p: number): S {
		return this.d[p];
	}

	prod(l: number, r: number): S {
		let sum = this.e();
		for (let i = l; i < r; i++) {
			sum = this.op(sum, this.d[i]);
		}
		return sum;
	}

	all_prod(): S {
		return this.prod(0, this.n);
	}

	max_right(l: number, f: SearchFunction<S>): number {
		let sum = this.e();
		ok(f(this.e()));
		for (let i = l; i < this.n; i++) {
			sum = this.op(sum, this.d[i]);
			if (!f(sum)) return i;
		}
		return this.n;
	}

	min_left(r: number, f: SearchFunction<S>): number {
		let sum = this.e();
		ok(f(this.e()));

		for (let i = r - 1; i >= 0; i--) {
			sum = this.op(this.d[i], sum);
			if (!f(sum)) return i + 1;
		}
		return 0;
	}
}

function op(a: string, b: string): string {
	ok(a === "$" || b === "$" || a < b);

	if (a === "$") return b;
	if (b === "$") return a;
	return a + b;
}

function e() {
	return "$";
}

const seg = (n: number) => new Segtree<string>(op, e, n);
const seg_naive = (n: number) => new SegtreeNaive<string>(op, e, n);

let y = "";
function leq_y(x: string) {
	return x.length <= y.length;
}

describe("SegtreeTest", () => {
	test("Zero", () => {
		{
			const s = seg(0);
			expect(s.all_prod()).toEqual("$");
		}
		{
			const s = new Segtree<string>(op, e);
			expect(s.all_prod()).toEqual("$");
		}
	}, 1000);

	test("Invalid", () => {
		expect(() => {
			const s = seg(-1);
		}).toThrowError();
		const s = seg(10);

		expect(() => s.get(-1)).toThrowError();
		expect(() => s.get(10)).toThrowError();

		expect(() => s.prod(-1, -1)).toThrowError();
		expect(() => s.prod(3, 2)).toThrowError();
		expect(() => s.prod(0, 11)).toThrowError();
		expect(() => s.prod(-1, 11)).toThrowError();

		expect(() => s.max_right(11, () => true)).toThrowError();
		expect(() => s.min_left(-1, () => true)).toThrowError();
		expect(() => s.max_right(0, () => false)).toThrowError();
	});

	test("One", () => {
		const s = seg(1);
		expect(s.all_prod()).toEqual("$");
		expect(s.get(0)).toEqual("$");
		expect(s.prod(0, 1)).toEqual("$");
		s.set(0, "dummy");
		expect(s.get(0)).toEqual("dummy");
		expect(s.prod(0, 0)).toEqual("$");
		expect(s.prod(0, 1)).toEqual("dummy");
		expect(s.prod(1, 1)).toEqual("$");
		expect(s.all_prod()).toEqual("dummy");
	});

	test("CompareNaive", () => {
		for (let n = 0; n < 30; n++) {
			const seg0 = seg_naive(n);
			const seg1 = seg(n);
			for (let i = 0; i < n; i++) {
				const s = String.fromCharCode(97 + i); // 97='a'
				seg0.set(i, s);
				seg1.set(i, s);
			}

			for (let l = 0; l <= n; l++) {
				for (let r = l; r <= n; r++) {
					expect(seg1.prod(l, r)).toEqual(seg0.prod(l, r));
				}
			}

			for (let l = 0; l <= n; l++) {
				for (let r = l; r <= n; r++) {
					y = seg1.prod(l, r);
					expect(seg1.max_right(l, leq_y)).toEqual(seg0.max_right(l, leq_y));
					expect(seg1.max_right(l, (x) => x.length <= y.length)).toEqual(
						seg0.max_right(l, leq_y)
					);
				}
			}

			for (let r = 0; r <= n; r++) {
				for (let l = 0; l <= r; l++) {
					y = seg1.prod(l, r);
					expect(seg1.min_left(r, leq_y)).toEqual(seg0.min_left(r, leq_y));
					expect(seg1.min_left(r, (x) => x.length <= y.length)).toEqual(
						seg0.min_left(r, leq_y)
					);
				}
			}
		}
	});

	test("Assign", () => {
		let seg0 = new Segtree<string>(op, e);
		seg0 = seg(10);
	});
});
