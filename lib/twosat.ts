import { InternalSCCGraph } from "./internal_scc";

export class TwoSat {
	private _n: number;
	private _answer: boolean[];
	private scc: InternalSCCGraph;

	constructor(n = 0) {
		this._n = n;
		this._answer = new Array<boolean>(n);
		this.scc = new InternalSCCGraph(2 * n);
	}

	add_clause(i: number, f: boolean, j: number, g: boolean): void {
		if (!(0 <= i && i < this._n && 0 <= j && j < this._n)) {
			throw new RangeError("Out of range");
		}

		this.scc.add_edge(2 * i + (f ? 0 : 1), 2 * j + (g ? 1 : 0));
		this.scc.add_edge(2 * j + (g ? 0 : 1), 2 * i + (f ? 1 : 0));
	}

	satisfiable(): boolean {
		const id = this.scc.scc_ids()[1];
		for (let i = 0; i < this._n; i++) {
			if (id[2 * i] === id[2 * i + 1]) return false;
			this._answer[i] = id[2 * i] < id[2 * i + 1];
		}
		return true;
	}

	answer(): boolean[] {
		return this._answer;
	}
}
