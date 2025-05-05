import { SimpleQueue } from "./internal_queue";
import type { Constructor, ll } from "./internal_types";
import {ok} from 'node:assert'

interface _Edge<Cap extends ll> {
	to: number;
	rev: number;
	cap: Cap;
}

export interface Edge<Cap extends ll> {
	from: number;
	to: number;
	cap: Cap;
	flow: Cap;
}

export class MfGraph<Cap extends ll> {
	private _n: number;
	private pos: [number, number][] = [];
	private g: _Edge<Cap>[][];
	private con: Constructor<Cap>;

	constructor(con: Constructor<Cap>, n = 0) {
		this._n = n;
		this.con = con;
		this.g = new Array<_Edge<Cap>[]>(n)
			.fill([])
			.map(() => new Array<_Edge<Cap>>());
	}

	add_edge(from: number, to: number, cap: Cap) {
		if (!(0 <= from && from < this._n) || !(0 <= to && to < this._n)) {
			throw new RangeError("Out of range");
		}
		if (cap < 0) {
			throw new RangeError("cap must be 0<=cap");
		}

		const m = this.pos.length;
		this.pos.push([from, this.g[from].length]);
		const from_id = this.g[from].length;
		let to_id = this.g[to].length;
		if (from === to) to_id++;
		this.g[from].push({
			to: to,
			rev: to_id,
			cap: cap,
		});
		this.g[to].push({
			to: from,
			rev: from_id,
			cap: this.con(0),
		});

		return m;
	}

	get_edge(i: number): Edge<Cap> {
		const m = this.pos.length;
		if (!(0 <= i && i < m)) {
			throw new RangeError("Out of range(edge)");
		}

		const _e = this.g[this.pos[i][0]][this.pos[i][1]];
		const _re = this.g[_e.to][_e.rev];
		return {
			from: this.pos[i][0],
			to: _e.to,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			cap: ((_e.cap as any) + _re.cap) as Cap,
			flow: _re.cap,
		};
	}

	edges(): Edge<Cap>[] {
		const m = this.pos.length;
		const result: Edge<Cap>[] = [];
		for (let i = 0; i < m; i++) {
			result.push(this.get_edge(i));
		}
		return result;
	}

	change_edge(i: number, new_cap: Cap, new_flow: Cap) {
		const m = this.pos.length;
		if (!(0 <= i && i < m)) {
			throw new RangeError("Out of range(edge)");
		}
		if (!(0 <= new_flow && new_flow <= new_cap)) {
			throw new RangeError("0 <= new_flow <= new_cap");
		}
		this.g[this.pos[i][0]][this.pos[i][1]].cap = (new_cap - new_flow) as Cap;
		const _e = this.g[this.pos[i][0]][this.pos[i][1]];
		this.g[_e.to][_e.rev].cap = new_flow;
	}

	flow(s: number, t: number): Cap; // (1)
	flow(s: number, t: number, flow_limit: Cap): Cap; // (2)

	flow(s: number, t: number, flow_limit?: Cap): Cap {
		if (flow_limit === undefined) {
			// (1)
			let max: Cap;
			if (typeof this.con(0) === "number") {
				max = Number.POSITIVE_INFINITY as Cap;
			} else {
				max = (1n << 64n) as Cap;
			}
			return this.flow(s, t, max);
		}
		// (2)
        ok(0 <= s && s < this._n);
        ok(0 <= t && t < this._n);
        ok(s !== t);

		const level=new Int32Array(this._n);
		const iter=new Int32Array(this._n)
		const que=new SimpleQueue<number>();

        const bfs = () =>{
			level.fill(-1)
            level[s] = 0;
            que.clear();
            que.push(s);
            while (!que.empty()) {
                const v = que.front();
                que.pop();
                for (const e of this.g[v]) {
                    if (e.cap === 0 || level[e.to] >= 0) continue;
                    level[e.to] = level[v] + 1;
                    if (e.to === t) return;
                    que.push(e.to);
                }
            }
        };
        const dfs =( v:number, up:Cap)=> {
            if (v === s) return up;
            const res = this.con(0);
            const level_v = level[v];
            for (let i = iter[v]; i < this.g[v].length; i++&&iter[v]++) {
                _edge& e = g[v][i];
                if (level_v <= level[e.to] || g[e.to][e.rev].cap == 0) continue;
                Cap d =
                    self(self, e.to, std::min(up - res, g[e.to][e.rev].cap));
                if (d <= 0) continue;
                g[v][i].cap += d;
                g[e.to][e.rev].cap -= d;
                res += d;
                if (res == up) return res;
            }
            level[v] = this._n;
            return res;
        };

        Cap flow = 0;
        while (flow < flow_limit) {
            bfs();
            if (level[t] == -1) break;
            std::fill(iter.begin(), iter.end(), 0);
            Cap f = dfs(dfs, t, flow_limit - flow);
            if (!f) break;
            flow += f;
        }
        return flow;
	}
}
