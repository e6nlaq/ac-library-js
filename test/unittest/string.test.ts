import { ok } from "node:assert";
import { describe, test, expect } from "bun:test";
import { suffix_array, z_algorithm, lcp_array, internal } from "@/string";
import {
	max_int,
	min_int,
	max_ll,
	min_ll,
	max_uint,
	min_uint,
	max_ull,
	min_ull,
} from "../utils/limit";

function sa_naive(s: Int32Array) {
	const n = s.length;
	const sa = new Int32Array(n).map((_, i) => i);
	sa.sort((l, r) => {
		const a = s.slice(l);
		const b = s.slice(r);

		return a < b ? -1 : a === b ? 0 : 1;
	});

	return sa;
}

function lcp_naive(s: Int32Array, sa: Int32Array) {
	const n = s.length;
	ok(n);
	const lcp = new Int32Array(n - 1);
	for (let i = 0; i < n - 1; i++) {
		const l = sa[i];
		const r = sa[i + 1];
		while (l + lcp[i] < n && r + lcp[i] < n && s[l + lcp[i]] === s[r + lcp[i]])
			lcp[i]++;
	}
	return lcp;
}

function z_naive(s: Int32Array) {
	const n = s.length;
	const z = new Int32Array(n);
	for (let i = 0; i < n; i++) {
		while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
	}
	return z;
}

describe("StringTest", () => {
	test("Empty", () => {
		expect(new Int32Array()).toEqual(suffix_array(""));
		expect(new Int32Array()).toEqual(suffix_array([]));

		expect(new Int32Array()).toEqual(z_algorithm(""));
		expect(new Int32Array()).toEqual(z_algorithm([]));
	});

	test("SALCPNaive", () => {
		for (let n = 1; n <= 5; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 4;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				let max_c = 0;
				for (let i = 0; i < n; i++) {
					s[i] = g % 4;
					max_c = Math.max(max_c, s[i]);
					g /= 4;
				}
				const sa = sa_naive(s);
				expect(sa).toEqual(suffix_array([...s]));
				expect(sa).toEqual(suffix_array(s, max_c));
				expect(lcp_naive(s, sa)).toEqual(lcp_array([...s], sa));
			}
		}
		for (let n = 1; n <= 10; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 2;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				let max_c = 0;
				for (let i = 0; i < n; i++) {
					s[i] = g % 2;
					max_c = Math.max(max_c, s[i]);
					g /= 2;
				}

				// console.log(s);
				const sa = sa_naive(s);
				expect(sa).toEqual(suffix_array([...s]));
				expect(sa).toEqual(suffix_array(s));
				expect(sa).toEqual(suffix_array(s, max_c));
				expect(lcp_naive(s, sa)).toEqual(lcp_array([...s], sa));
				expect(lcp_naive(s, sa)).toEqual(lcp_array(s, sa));
			}
		}
	});

	test("InternalSANaiveNaive", () => {
		for (let n = 1; n <= 5; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 4;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				let max_c = 0;
				for (let i = 0; i < n; i++) {
					s[i] = g % 4;
					max_c = Math.max(max_c, s[i]);
					g /= 4;
				}

				const sa = internal.sa_naive(s);
				expect(sa_naive(s)).toEqual(sa);
			}
		}
		for (let n = 1; n <= 10; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 2;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				for (let i = 0; i < n; i++) {
					s[i] = g % 2;
					g /= 2;
				}

				const sa = internal.sa_naive(s);
				expect(sa_naive(s)).toEqual(sa);
			}
		}
	});

	test("InternalSADoublingNaive", () => {
		for (let n = 1; n <= 5; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 4;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				for (let i = 0; i < n; i++) {
					s[i] = g % 4;
					g /= 4;
				}

				const sa = internal.sa_doubling(s);
				expect(sa_naive(s)).toEqual(sa);
			}
		}
		for (let n = 1; n <= 10; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 2;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				for (let i = 0; i < n; i++) {
					s[i] = g % 2;
					g /= 2;
				}

				const sa = internal.sa_doubling(s);
				expect(sa_naive(s)).toEqual(sa);
			}
		}
	});

	test("InternalSAISNaive", () => {
		for (let n = 1; n <= 5; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 4;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				let max_c = 0;
				for (let i = 0; i < n; i++) {
					s[i] = g % 4;
					max_c = Math.max(max_c, s[i]);
					g /= 4;
				}

				const sa = internal.sa_is(s, max_c, -1, -1);
				expect(sa_naive(s)).toEqual(sa);
			}
		}
		for (let n = 1; n <= 10; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 2;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				let max_c = 0;
				for (let i = 0; i < n; i++) {
					s[i] = g % 2;
					max_c = Math.max(max_c, s[i]);
					g /= 2;
				}

				const sa = internal.sa_is(s, max_c, -1, -1);
				expect(sa_naive(s)).toEqual(sa);
			}
		}
	});

	test("SAAllATest", () => {
		for (let n = 1; n <= 100; n++) {
			const s = new Int32Array(n).fill(10);
			expect(sa_naive(s)).toEqual(suffix_array([...s]));
			expect(sa_naive(s)).toEqual(suffix_array(s));
			expect(sa_naive(s)).toEqual(suffix_array(s, 10));
			expect(sa_naive(s)).toEqual(suffix_array(s, 12));
		}
	});

	test("SAAllABTest", () => {
		for (let n = 1; n <= 100; n++) {
			const s = new Int32Array(n);
			for (let i = 0; i < n; i++) s[i] = i % 2;
			expect(sa_naive(s)).toEqual(suffix_array([...s]));
			expect(sa_naive(s)).toEqual(suffix_array(s, 3));
		}
		for (let n = 1; n <= 100; n++) {
			const s = new Int32Array(n);
			for (let i = 0; i < n; i++) s[i] = 1 - (i % 2);
			expect(sa_naive(s)).toEqual(suffix_array([...s]));
			expect(sa_naive(s)).toEqual(suffix_array(s));
			expect(sa_naive(s)).toEqual(suffix_array(s, 3));
		}
	});

	test("SA", () => {
		const s = "missisippi";

		const sa = suffix_array(s);

		const answer = [
			"i", // 9
			"ippi", // 6
			"isippi", // 4
			"issisippi", // 1
			"missisippi", // 0
			"pi", // 8
			"ppi", // 7
			"sippi", // 5
			"sisippi", // 3
			"ssisippi", // 2
		];

		expect(answer.length).toEqual(sa.length);

		for (let i = 0; i < sa.length; i++) {
			expect(answer[i]).toEqual(s.substring(sa[i]));
		}
	});

	test("SASingle", () => {
		expect(new Int32Array([0])).toEqual(suffix_array([0]));
		expect(new Int32Array([0])).toEqual(suffix_array([-1]));
		expect(new Int32Array([0])).toEqual(suffix_array([1]));
		expect(new Int32Array([0])).toEqual(suffix_array([min_int]));
		expect(new Int32Array([0])).toEqual(suffix_array([max_int]));
	});

	test("LCP", () => {
		const s = "aab";
		const sa = suffix_array(s);
		expect(sa).toEqual(new Int32Array([0, 1, 2]));
		const lcp = lcp_array(s, sa);
		expect(lcp).toEqual(new Int32Array([1, 0]));

		expect(lcp).toEqual(lcp_array([0, 0, 1], sa));
		expect(lcp).toEqual(lcp_array([-100, -100, 100], sa));
		expect(lcp).toEqual(lcp_array([min_int, min_int, max_int], sa));
		expect(lcp).toEqual(lcp_array([min_ll, min_ll, max_ll], sa));
		expect(lcp).toEqual(lcp_array([min_uint, min_uint, max_uint], sa));
		expect(lcp).toEqual(lcp_array([min_ull, min_ull, max_ull], sa));
	});

	test("ZAlgo", () => {
		const s = "abab";
		const z = z_algorithm(s);
		expect(new Int32Array([4, 0, 2, 0])).toEqual(z);
		expect(new Int32Array([4, 0, 2, 0])).toEqual(z_algorithm([1, 10, 1, 10]));

		expect(z_algorithm([0, 0, 0, 0, 0, 0, 0])).toEqual(
			z_naive(new Int32Array([0, 0, 0, 0, 0, 0, 0]))
		);
	});

	test("ZNaive", () => {
		for (let n = 1; n <= 6; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 4;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				for (let i = 0; i < n; i++) {
					s[i] = g % 4;
					g /= 4;
				}
				expect(z_naive(s)).toEqual(z_algorithm(s));
			}
		}
		for (let n = 1; n <= 10; n++) {
			let m = 1;
			for (let i = 0; i < n; i++) m *= 2;
			for (let f = 0; f < m; f++) {
				const s = new Int32Array(n);
				let g = f;
				for (let i = 0; i < n; i++) {
					s[i] = g % 2;
					g /= 2;
				}
				expect(z_naive(s)).toEqual(z_algorithm(s));
			}
		}
	});
});
