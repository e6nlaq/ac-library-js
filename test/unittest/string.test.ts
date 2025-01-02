import { ok } from "node:assert";
import { describe, test, expect } from "bun:test";
import { suffix_array } from "@/string";

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
		expect(new Int32Array(0)).toEqual(suffix_array(""));
	});
});
