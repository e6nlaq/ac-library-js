import { InternalSCCGraph } from "./internal_scc";

export class SCCGraph {
	private internal: InternalSCCGraph;

	constructor(n = 0) {
		this.internal = new InternalSCCGraph(n);
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
