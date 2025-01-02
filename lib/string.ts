import { isInt32Array } from "node:util/types";
import type { vi } from "./internal_types";

export namespace internal {
	export function sa_naive(s: Int32Array) {
		const n = s.length;
		const sa = Int32Array.from({ length: n }, (_, i) => i);
		sa.sort((l, r) => {
			if (l === r) return 0;
			while (l < n && r < n) {
				if (s[l] !== s[r]) return s[l] - s[r];
				l++;
				r++;
			}
			return l === n ? -1 : 1;
		});
		return sa;
	}

	export function sa_doubling(s: Int32Array) {
		const n = s.length;
		const sa = Int32Array.from({ length: n }, (_, i) => i);
		let rnk = new Int32Array(n);
		rnk.set(sa);
		let tmp = new Int32Array(n);

		for (let k = 1; k < n; k *= 2) {
			const cmp = (x: number, y: number) => {
				if (rnk[x] !== rnk[y]) return rnk[x] - rnk[y];
				const rx = x + k < n ? rnk[x + k] : -1;
				const ry = y + k < n ? rnk[y + k] : -1;
				return rx - ry;
			};

			sa.sort(cmp);

			tmp[sa[0]] = 0;
			for (let i = 1; i < n; i++) {
				tmp[sa[i]] = tmp[sa[i - 1]] + (cmp(sa[i - 1], sa[i]) < 0 ? 1 : 0);
			}

			[rnk, tmp] = [tmp, rnk];
		}

		return sa;
	}

	export function sa_is(
		s: Int32Array,
		upper: number,
		THRESHOLD_NAIVE = 10,
		THRESHOLD_DOUBLING = 40
	) {
		const n = s.length;
		if (n === 0) return new Int32Array();
		if (n === 1) return new Int32Array([0]);
		if (n === 2) {
			if (s[0] < s[1]) {
				return new Int32Array([0, 1]);
			}
			return new Int32Array([1, 0]);
		}
		if (n < THRESHOLD_NAIVE) {
			return sa_naive(s);
		}
		if (n < THRESHOLD_DOUBLING) {
			return sa_doubling(s);
		}

		const sa = new Int32Array(n);
		const ls = new Array<boolean>(n).fill(false);
		for (let i = n - 2; i >= 0; i--) {
			ls[i] = s[i] === s[i + 1] ? ls[i + 1] : s[i] < s[i + 1];
		}
		const sum_l = new Int32Array(upper + 1);
		const sum_s = new Int32Array(upper + 1);
		for (let i = 0; i < n; i++) {
			if (!ls[i]) {
				sum_s[s[i]]++;
			} else {
				sum_l[s[i] + 1]++;
			}
		}
		for (let i = 0; i <= upper; i++) {
			sum_s[i] += sum_l[i];
			if (i < upper) sum_l[i + 1] += sum_s[i];
		}

		const induce = (lms: Int32Array) => {
			sa.fill(-1);
			const buf = new Int32Array(upper + 1);
			sum_s.set(buf);
			for (const d of lms) {
				if (d === n) continue;
				sa[buf[s[d]]++] = d;
			}
			sum_l.set(buf);
			sa[buf[s[n - 1]]++] = n - 1;
			for (let i = 0; i < n; i++) {
				const v = sa[i];
				if (v >= 1 && !ls[v - 1]) {
					sa[buf[s[v - 1]]++] = v - 1;
				}
			}
			sum_l.set(buf);
			for (let i = n - 1; i >= 0; i--) {
				const v = sa[i];
				if (v >= 1 && ls[v - 1]) {
					sa[--buf[s[v - 1] + 1]] = v - 1;
				}
			}
		};

		const lms_map = new Int32Array(n + 1).fill(-1);
		let m = 0;
		for (let i = 1; i < n; i++) {
			if (!ls[i - 1] && ls[i]) {
				lms_map[i] = m++;
			}
		}

		const lms = new Array<number>();
		for (let i = 1; i < n; i++) {
			if (!ls[i - 1] && ls[i]) {
				lms.push(i);
			}
		}

		induce(new Int32Array(lms));

		if (m) {
			const sorted_lms = new Array<number>();
			for (const v of sa) {
				if (lms_map[v] !== -1) sorted_lms.push(v);
			}
			const rec_s = new Int32Array(m);
			let rec_upper = 0;
			rec_s[lms_map[sorted_lms[0]]] = 0;
			for (let i = 1; i < m; i++) {
				let l = sorted_lms[i - 1];
				let r = sorted_lms[i];
				const end_l = lms_map[l] + 1 < m ? lms[lms_map[l] + 1] : n;
				const end_r = lms_map[r] + 1 < m ? lms[lms_map[r] + 1] : n;
				let same = true;
				if (end_l - l !== end_r - r) {
					same = false;
				} else {
					while (l < end_l) {
						if (s[l] !== s[r]) {
							break;
						}
						l++;
						r++;
					}
					if (l === n || s[l] !== s[r]) same = false;
				}
				if (!same) rec_upper++;
				rec_s[lms_map[sorted_lms[i]]] = rec_upper;
			}

			const rec_sa = sa_is(
				rec_s,
				rec_upper,
				THRESHOLD_NAIVE,
				THRESHOLD_DOUBLING
			);

			for (let i = 0; i < m; i++) {
				sorted_lms[i] = lms[rec_sa[i]];
			}
			// induce(sorted_lms);
			induce(new Int32Array(sorted_lms));
		}
		return sa;
	}
} // namespace internal

export function suffix_array(s: string): Int32Array<ArrayBuffer>; // (1)
export function suffix_array<T>(s: T[]): Int32Array<ArrayBuffer>; // (2)

// (3)
export function suffix_array(s: vi, upper: number): Int32Array<ArrayBuffer>;

export function suffix_array<T>(s: string | T[] | vi, upper?: number) {
	if (upper !== undefined) {
		// (3)
		if (!isInt32Array(s)) {
			s = new Int32Array(s as number[]);
		}

		if (upper < 0) {
			throw new RangeError("upper must be 0<=upper");
		}
		for (const d of s) {
			if (!(0 <= d && d <= upper)) {
				throw new RangeError("s[i] must be 0<=s[i]<=upper");
			}
		}
		const sa = internal.sa_is(s, upper);
		return sa;
	}

	if (isInt32Array(s)) {
		throw new RangeError("upper is requied if s is `Int32Array`");
	}

	if (typeof s === "string") {
		// (1)
		const n = s.length;
		const s2 = new Int32Array(n);
		for (let i = 0; i < n; i++) {
			s2[i] = s.charCodeAt(i);
		}
		return internal.sa_is(s2, 255);
	}

	// (2)
	s = s as T[];
	const n = s.length;
	const idx = Int32Array.from({ length: n }, (_, i) => i);

	idx.sort((l, r) => (s[l] < s[r] ? -1 : s[l] === s[r] ? 0 : 1));
	const s2 = new Int32Array(n);

	let now = 0;
	for (let i = 0; i < n; i++) {
		if (i && s[idx[i - 1]] !== s[idx[i]]) now++;
		s2[idx[i]] = now;
	}
	return internal.sa_is(s2, now);
}

export function lcp_array(s: string, sa: vi): Int32Array<ArrayBuffer>; //(1)
export function lcp_array<T>(s: T[], sa: vi): Int32Array<ArrayBuffer>; //(2)

export function lcp_array<T>(s: string | T[], sa: vi) {
	if (!isInt32Array(sa)) {
		sa = new Int32Array(sa);
	}

	if (typeof s === "string") {
		const n = s.length;
		const s2 = new Array<number>(n);
		for (let i = 0; i < n; i++) {
			s2[i] = s.charCodeAt(i);
		}
		return lcp_array(s2, sa);
	}

	const n = s.length;
	if (n < 1) {
		throw new RangeError("n must be 1<=n");
	}
	const rnk = new Int32Array(n);
	for (let i = 0; i < n; i++) {
		rnk[sa[i]] = i;
	}
	const lcp = new Int32Array(n - 1);
	let h = 0;
	for (let i = 0; i < n; i++) {
		if (h > 0) h--;
		if (rnk[i] === 0) continue;
		const j = sa[rnk[i] - 1];
		for (; j + h < n && i + h < n; h++) {
			if (s[j + h] !== s[i + h]) break;
		}
		lcp[rnk[i] - 1] = h;
	}
	return lcp;
}

export function z_algorithm(s: string): Int32Array<ArrayBuffer>; //(1)
export function z_algorithm<T>(s: T[]): Int32Array<ArrayBuffer>; //(2)

export function z_algorithm<T>(s: string | T[]) {
	if (typeof s === "string") {
		// (1)
		const n = s.length;
		const s2 = new Array<number>(n);
		for (let i = 0; i < n; i++) {
			s2[i] = s.charCodeAt(i);
		}
		return z_algorithm(s2);
	}

	// (2)
	const n = s.length;
	if (n === 0) return new Int32Array();
	const z = new Int32Array(n);
	z[0] = 0;
	for (let i = 1, j = 0; i < n; i++) {
		let k = z[i];
		k = j + z[j] <= i ? 0 : Math.min(j + z[j] - i, z[i - j]);
		while (i + k < n && s[k] === s[i + k]) k++;
		if (j + z[j] < i + z[i]) j = i;
	}
	z[0] = n;
	return z;
}
