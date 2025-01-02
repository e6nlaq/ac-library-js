// Verified: https://atcoder.jp/contests/practice2/submissions/61317841

import { suffix_array, lcp_array } from 'ac-library-js/string';
import { readFileSync } from 'node:fs';

function main(inp: string[][]): void {
	const S = inp[0][0];
	const N = S.length;

	const sa = suffix_array(S);
	const lcp = lcp_array(S, sa);
	console.log((N * (N + 1)) / 2 - lcp.reduce((s, v) => s + v));
}

main(
	readFileSync('/dev/stdin', 'utf-8')
		.split('\n')
		.map(line => line.split(' ')),
);
