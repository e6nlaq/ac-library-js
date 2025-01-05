export class Csr<E> {
	readonly start: Int32Array<ArrayBuffer>;
	readonly elist: E[];

	constructor(n: number, edges: [number, E][]) {
		this.start = new Int32Array(n + 1);
		this.elist = new Array<E>(edges.length);

		for (const [v, _] of edges) {
			this.start[v + 1]++;
		}

		for (let i = 1; i <= n; i++) {
			this.start[i] += this.start[i - 1];
		}

		const counter = this.start.slice();
		for (const [v, e] of edges) {
			this.elist[counter[v]++] = e;
		}
	}
}
