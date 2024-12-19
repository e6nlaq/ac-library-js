import { readFileSync } from "node:fs";
import { TwoSat } from "ac-library-js/twosat";

const abs = Math.abs;

function main(inp: string[][]): void {
	const [N, D] = inp[0].map(Number);
	const sat = new TwoSat(N);
	const X: number[] = [];
	const Y: number[] = [];

	for (let i = 0; i < N; i++) {
		const [x, y] = inp[1 + i].map(Number);
		X.push(x);
		Y.push(y);
	}

	for (let i = 0; i < N - 1; i++) {
		for (let j = i + 1; j < N; j++) {
			if (abs(X[i] - X[j]) < D) {
				sat.add_clause(i, false, j, false);
			}

			if (abs(X[i] - Y[j]) < D) {
				sat.add_clause(i, false, j, true);
			}

			if (abs(Y[i] - Y[j]) < D) {
				sat.add_clause(i, true, j, true);
			}

			if (abs(Y[i] - X[j]) < D) {
				sat.add_clause(i, true, j, false);
			}
		}
	}

	if (!sat.satisfiable()) {
		console.log("No");
	} else {
		console.log("Yes");
		const ans = sat.answer();
		for (let i = 0; i < N; i++) {
			if (ans[i]) {
				console.log(X[i]);
			} else {
				console.log(Y[i]);
			}
		}
	}
}

main(
	readFileSync("/dev/stdin", "utf-8")
		.split("\n")
		.map((line) => line.split(" "))
);
