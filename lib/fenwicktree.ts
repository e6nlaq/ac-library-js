import { type ModIntFunction, ModInt } from "./modint";

type NumConstructor<M extends number> =
	| NumberConstructor
	| BigIntConstructor
	| ModIntFunction<M>;

export class FenwickTree<M extends number> {
	private _n: number;
	private data: ReturnType<NumConstructor<M>>[];
	private t: NumConstructor<M>;

	private _sum(r: number): ReturnType<NumConstructor<M>> {
		if (this.t === Number) {
			let s = 0;
			while (r > 0) {
				s += this.data[r - 1] as number;
				r -= r & -r;
			}
			return s;
		}
		if (this.t === BigInt) {
			let s = 0n;
			while (r > 0) {
				s += this.data[r - 1] as bigint;
				r -= r & -r;
			}
			return s;
		}
		if (this.t(0) instanceof ModInt) {
			const s = this.t(0) as ModInt<M>;
			while (r > 0) {
				s.adda(this.data[r - 1] as ModInt<M>);
				r -= r & -r;
			}
			return s;
		}

		throw new Error();
	}

	constructor(t: NumConstructor<M>, n = 0) {
		this._n = n;
		this.t = t;
		this.data = new Array<ReturnType<NumConstructor<M>>>(n).fill(t(0));
	}

	add(p: number, x: ReturnType<NumConstructor<M>>): void {
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

	sum(l: number, r: number): ReturnType<NumConstructor<M>> {
		if (!(0 <= l && l <= r && r <= this._n)) {
			throw new RangeError("Out of range");
		}

		if (this.t === Number) {
			return (this._sum(r) as number) - (this._sum(l) as number);
		}
		if (this.t === BigInt) {
			return (this._sum(r) as bigint) - (this._sum(l) as bigint);
		}
		return (this._sum(r) as ModInt<M>).sub(this._sum(l));
	}
}
