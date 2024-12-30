export namespace internal {
	export function sa_naive(s: Int32Array): Int32Array {
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

	export function sa_doubling(s: Int32Array): Int32Array {
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
} // namespace internal
