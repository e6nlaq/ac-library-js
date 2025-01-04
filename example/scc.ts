// Verified: https://atcoder.jp/contests/practice2/submissions/61317841

import { readFileSync } from "node:fs";
import { SCCGraph } from "ac-library-js/scc";

function main(inp: string[][]): void {
	const [N, M] = inp[0].map(Number);
	const G = new SCCGraph(N);

	for (let i = 1; i <= M; i++) {
		const [a, b] = inp[i].map(Number);
		G.add_edge(a, b);
	}

	const ans = G.scc();
	console.log(ans.length);
	for (let i = 0; i < ans.length; i++)
		console.log(`${ans[i].length} ${ans[i].join(" ")}`);
}

main(
	readFileSync("/dev/stdin", "utf-8")
		.split("\n")
		.map((line) => line.split(" "))
);
