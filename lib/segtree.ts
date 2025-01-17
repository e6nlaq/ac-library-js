import { bit_ceil, countr_zero } from "./internal_bit";
import type {
	ElementType,
	OperatorType,
	SearchFunction,
	typevi,
	typevll,
} from "./internal_types";
export class Segtree<S> {
	private op: OperatorType<S>;
	private e: ElementType<S>;

	private _n: number;
	private size: number;
	private log: number;
	private d: Array<S>;

	private update(k: number): void {
		this.d[k] = this.op(this.d[2 * k], this.d[2 * k + 1]);
	}

	private range_assert(x: number, right = false): void {
		if (x < 0 || x >= this._n + Number(right)) {
			throw new RangeError("Index out of range");
		}
	}

	constructor(
		op: OperatorType<S>,
		e: ElementType<S>,
		v:
			| number
			| S[]
			| (S extends number ? typevi : never)
			| (S extends bigint ? typevll : never) = 0
	) {
		this.op = op;
		this.e = e;

		if (typeof v === "number") {
			v = new Array<S>(v).fill(null as S).map(e);
		}

		this._n = v.length;
		this.size = bit_ceil(this._n);
		this.log = countr_zero(this.size);
		this.d = new Array(2 * this.size);
		for (let i = 0; i < this.d.length; i++) this.d[i] = this.e();

		for (let i = 0; i < this._n; i++) {
			this.d[this.size + i] = v[i] as S;
		}

		for (let i = this.size - 1; i >= 1; i--) {
			this.update(i);
		}
	}

	set(p: number, x: S): void {
		this.range_assert(p);

		p += this.size;
		this.d[p] = x;
		for (let i = 1; i <= this.log; i++) this.update(p >> i);
	}

	get(p: number): S {
		this.range_assert(p);
		return this.d[p + this.size];
	}

	prod(l: number, r: number): S {
		if (!(0 <= l && l <= r && r <= this._n)) {
			throw new RangeError(`Not 0 <= l <= r <= ${this._n}`);
		}

		let sml = this.e();
		let smr = this.e();

		l += this.size;
		r += this.size;

		while (l < r) {
			if (l & 1) sml = this.op(sml, this.d[l++]);
			if (r & 1) smr = this.op(this.d[--r], smr);
			l >>= 1;
			r >>= 1;
		}

		return this.op(sml, smr);
	}

	all_prod(): S {
		return this.d[1];
	}

	max_right(l: number, f: SearchFunction<S>): number {
		this.range_assert(l, true);
		if (!f(this.e())) {
			throw new Error("f(e()) must be true.");
		}

		if (l === this._n) return this._n;
		l += this.size;
		let sm = this.e();

		do {
			while (l % 2 === 0) l >>= 1;
			if (!f(this.op(sm, this.d[l]))) {
				while (l < this.size) {
					l *= 2;
					if (f(this.op(sm, this.d[l]))) {
						sm = this.op(sm, this.d[l]);
						l++;
					}
				}
				return l - this.size;
			}
			sm = this.op(sm, this.d[l]);
			l++;
		} while ((l & -l) !== l);

		return this._n;
	}

	min_left(r: number, f: SearchFunction<S>): number {
		this.range_assert(r, true);
		if (!f(this.e())) {
			throw new Error("f(e()) must be true.");
		}

		if (r === 0) return 0;
		r += this.size;
		let sm = this.e();
		do {
			r--;
			while (r > 1 && r % 2) r >>= 1;
			if (!f(this.op(this.d[r], sm))) {
				while (r < this.size) {
					r = 2 * r + 1;
					if (f(this.op(this.d[r], sm))) {
						sm = this.op(this.d[r], sm);
						r--;
					}
				}
				return r + 1 - this.size;
			}
			sm = this.op(this.d[r], sm);
		} while ((r & -r) !== r);

		return 0;
	}
}
