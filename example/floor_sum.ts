// Verified: https://atcoder.jp/contests/practice2/submissions/60893797

import { readFileSync } from "node:fs";
import { floor_sum } from "ac-library-js/math";

function main(inp: string[][]): void {
	const T = Number(inp[0][0]);
	for (let i = 1; i <= T; i++) {
		const [N, M, A, B] = inp[i].map(Number);
		console.log(floor_sum(N, M, A, B).toString());
	}
}

main(
	readFileSync("/dev/stdin", "utf-8")
		.split("\n")
		.map((line) => line.split(" "))
);
