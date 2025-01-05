// Verified: https://atcoder.jp/contests/practice2/submissions/61415542

import { readFileSync } from 'node:fs';
import { LazySegtree } from 'ac-library-js/lazysegtree';

interface S {
	zero: bigint;
	one: bigint;
	inversion: bigint;
}

type F = boolean;

function op(l: S, r: S): S {
	return {
		zero: l.zero + r.zero,
		one: l.one + r.one,
		inversion: l.inversion + r.inversion + l.one * r.zero,
	};
}

function e(): S {
	return {
		zero: 0n,
		one: 0n,
		inversion: 0n,
	};
}

function mapping(l: F, r: S): S {
	if (!l) return r;
	return {
		zero: r.one,
		one: r.zero,
		inversion: r.one * r.zero - r.inversion,
	};
}

function composition(l: F, r: F): F {
	return (l && !r) || (!l && r);
}

function id(): F {
	return false;
}

function main(inp: string[][]): void {
	const [N, Q] = inp[0].map(Number);
	const A = inp[1].map(Number);
	const seg = new LazySegtree<S, F>(op, e, mapping, composition, id, N);
	for (let i = 0; i < N; i++) {
		if (A[i] === 0) seg.set(i, { zero: 1n, one: 0n, inversion: 0n });
		else seg.set(i, { zero: 0n, one: 1n, inversion: 0n });
	}

	for (let q = 0; q < Q; q++) {
		let [t, l, r] = inp[2 + q].map(Number);
		l--;
		if (t === 1) {
			seg.apply(l, r, true);
		} else {
			console.log(seg.prod(l, r).inversion.toString());
		}
	}
}

main(
	readFileSync('/dev/stdin', 'utf-8')
		.split('\n')
		.map(line => line.split(' ')),
);
