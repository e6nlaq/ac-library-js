import { describe, expect, test } from "bun:test";
import { TwoSat } from "@/twosat";
import { randbool, randint } from "../utils/random";

describe("TwosatTest", () => {
	test("Empty", () => {
		const ts0 = new TwoSat();
		expect(ts0.satisfiable()).toBeTruthy();
		expect(ts0.answer()).toEqual([]);

		const ts1 = new TwoSat(0);
		expect(ts1.satisfiable()).toBeTruthy();
		expect(ts1.answer()).toEqual([]);
	});

	test("One", () => {
		{
			const ts = new TwoSat(1);
			ts.add_clause(0, true, 0, true);
			ts.add_clause(0, false, 0, false);
			expect(ts.satisfiable()).toBeFalsy();
		}
		{
			const ts = new TwoSat(1);
			ts.add_clause(0, true, 0, true);
			expect(ts.satisfiable()).toBeTruthy();
			expect(ts.answer()).toEqual([true]);
		}
		{
			const ts = new TwoSat(1);
			ts.add_clause(0, false, 0, false);
			expect(ts.satisfiable()).toBeTruthy();
			expect(ts.answer()).toEqual([false]);
		}
	});

	test("Assign", () => {
		let ts = new TwoSat();
		ts = new TwoSat(10);
	});

	test("StressOK", () => {
		for (let phase = 0; phase < 10000; phase++) {
			const n = randint(1, 20);
			const m = randint(1, 100);
			const exp = new Array<boolean>(n);
			for (let i = 0; i < n; i++) {
				exp[i] = randbool();
			}

			const ts = new TwoSat(n);

			const xs = new Int32Array(m);
			const ys = new Int32Array(m);
			const types = new Int32Array(m);
			for (let i = 0; i < m; i++) {
				const x = randint(0, n - 1);
				const y = randint(0, n - 1);
				const type = randint(0, 2);
				xs[i] = x;
				ys[i] = y;
				types[i] = type;
				if (type === 0) {
					ts.add_clause(x, exp[x], y, exp[y]);
				} else if (type === 1) {
					ts.add_clause(x, !exp[x], y, exp[y]);
				} else {
					ts.add_clause(x, exp[x], y, !exp[y]);
				}
			}
			expect(ts.satisfiable()).toBeTruthy();
			const actual = ts.answer();
			for (let i = 0; i < m; i++) {
				const x = xs[i];
				const y = ys[i];
				const type = types[i];
				if (type === 0) {
					expect(actual[x] === exp[x] || actual[y] === exp[y]).toBeTruthy();
				} else if (type === 1) {
					expect(actual[x] !== exp[x] || actual[y] === exp[y]).toBeTruthy();
				} else {
					expect(actual[x] === exp[x] || actual[y] !== exp[y]).toBeTruthy();
				}
			}
		}
	});
});
