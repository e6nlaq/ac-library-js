import { CSR } from "./internal_csr";

type Edge = { to: number };

export class SCCGraph {
	private _n: number;
	private edges: [number, Edge][];

	constructor(n: number) {
		this._n = n;
		this.edges = [];
	}

	num_vertices(): number {
		return this._n;
	}

	add_edge(from: number, to: number): void {
		this.edges.push([from, { to }]);
	}

	// Returns [number of SCCs, SCC ids]
	scc_ids(): [number, Int32Array] {
		const g = new CSR<Edge>(this._n, this.edges);
		let now_ord = 0;
		let group_num = 0;
		const visited: number[] = [];
		const low = new Int32Array(this._n);
		const ord = new Int32Array(this._n).fill(-1);
		const ids = new Int32Array(this._n);

		const dfs = (v: number): void => {
			low[v] = ord[v] = now_ord++;
			visited.push(v);

			for (let i = g.start[v]; i < g.start[v + 1]; i++) {
				const to = g.elist[i].to;
				if (ord[to] === -1) {
					dfs(to);
					low[v] = Math.min(low[v], low[to]);
				} else {
					low[v] = Math.min(low[v], ord[to]);
				}
			}

			if (low[v] === ord[v]) {
				while (true) {
					const u = visited[visited.length - 1];
					visited.pop();
					ord[u] = this._n;
					ids[u] = group_num;
					if (u === v) break;
				}
				group_num++;
			}
		};

		for (let i = 0; i < this._n; i++) {
			if (ord[i] === -1) dfs(i);
		}

		for (let i = 0; i < this._n; i++) {
			ids[i] = group_num - 1 - ids[i];
		}

		return [group_num, ids];
	}

	scc(): number[][] {
		const [group_num, ids] = this.scc_ids();
		const counts = new Int32Array(group_num);

		for (const id of ids) {
			counts[id]++;
		}

		const groups = new Array<number[]>(group_num)
			.fill([])
			.map((): number[] => []);

		for (let i = 0; i < this._n; i++) {
			groups[ids[i]].push(i);
		}

		return groups;
	}
}
