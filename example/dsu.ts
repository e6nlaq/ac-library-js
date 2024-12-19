// Verified: https://atcoder.jp/contests/practice2/submissions/60877107

import { readFileSync } from "node:fs";
import { DSU } from "ac-library-js/dsu";

function main(inp: string[][]): void {
	const [N, Q] = inp[0].map(Number);
	const uf = new DSU(N);
	for (let i = 0; i < Q; i++) {
		const [t, u, v] = inp[i + 1].map(Number);
		if (t === 0) {
			uf.merge(u, v);
		} else {
			console.log(uf.same(u, v) ? "1" : "0");
		}
	}
}

main(
	readFileSync("/dev/stdin", "utf-8")
		.split("\n")
		.map((line) => line.split(" "))
);
