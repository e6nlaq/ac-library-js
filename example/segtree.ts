// Verified: https://atcoder.jp/contests/practice2/submissions/60894090

import { readFileSync } from "node:fs";
import { Segtree } from "ac-library-js/segtree";

function main(inp: string[][]): void {
	const [N, Q] = inp[0].map(Number);
	const A = inp[1].map(Number);
	const seg = new Segtree(
		(a, b) => Math.max(a, b),
		() => -1,
		A
	);

	for (let i = 0; i < Q; i++) {
		const [t, a, b] = inp[2 + i].map(Number);
		if (t === 1) {
			seg.set(a - 1, b);
		} else if (t === 2) {
			console.log(seg.prod(a - 1, b));
		} else {
			console.log(seg.max_right(a - 1, (x) => x < b) + 1);
		}
	}
}

main(
	readFileSync("/dev/stdin", "utf-8")
		.split("\n")
		.map((line) => line.split(" "))
);
