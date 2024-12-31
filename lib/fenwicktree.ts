import { ModInt, type ModIntFunction } from "./modint";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Constructor<T> = (arg: any) => T;

export class FenwickTree<
	T extends number | bigint | ModInt<M>,
	M extends number = number,
> {
	private _n: number;
	private data: T[];
	private t: T extends ModInt<M> ? ModIntFunction<M> : Constructor<T>;

	private _sum(r: number): T {
		if (typeof this.t(0) === "number") {
			let s = 0;
			while (r > 0) {
				s += this.data[r - 1] as number;
				r -= r & -r;
			}
			return s as T;
		}
		if (typeof this.t(0) === "bigint") {
			let s = 0n;
			while (r > 0) {
				s += this.data[r - 1] as bigint;
				r -= r & -r;
			}
			return s as T;
		}
		if (this.t(0) instanceof ModInt) {
			const s = this.t(0) as ModInt<M>;
			while (r > 0) {
				s.adda(this.data[r - 1] as ModInt<M>);
				r -= r & -r;
			}
			return s as T;
		}

		throw new Error();
	}

	constructor(t: typeof this.t, n = 0) {
		this._n = n;
		this.t = t;
		this.data = new Array<T>(n).fill(t(0) as T);
	}

	add(p: number, x: T): void {
		if (!(0 <= p && p < this._n)) {
			throw new RangeError("Out of range");
		}

		p++;
		while (p <= this._n) {
			if (typeof x === "number") {
				(this.data[p - 1] as number) += x;
			} else if (typeof x === "bigint") {
				(this.data[p - 1] as bigint) += x;
			} else {
				(this.data[p - 1] as ModInt<M>).adda(x);
			}
			p += p & -p;
		}
	}

	sum(l: number, r: number): T {
		if (!(0 <= l && l <= r && r <= this._n)) {
			throw new RangeError("Out of range");
		}

		if (typeof this.t(0) === "number") {
			return ((this._sum(r) as number) - (this._sum(l) as number)) as T;
		}
		if (typeof this.t(0) === "bigint") {
			return ((this._sum(r) as bigint) - (this._sum(l) as bigint)) as T;
		}
		return (this._sum(r) as ModInt<M>).sub(this._sum(l)) as T;
	}
}
