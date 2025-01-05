import { InternalSccGraph } from "./internal_scc";

export class SccGraph {
	private internal: InternalSccGraph;

	constructor(n = 0) {
		this.internal = new InternalSccGraph(n);
	}

	add_edge(from: number, to: number): void {
		const n = this.internal.num_vertices();
		if (!(0 <= from && from < n && 0 <= to && to < n)) {
			throw new RangeError("Out of range");
		}

		this.internal.add_edge(from, to);
	}

	scc() {
		return this.internal.scc();
	}
}
