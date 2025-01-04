import { bit_ceil, countr_zero } from "./internal_bit";
import type {
	CompositionType,
	ElementType,
	IdType,
	MappingType,
	OperatorType,
	SearchFunction,
} from "./internal_types";

export class LazySegtree<S, F> {
	private op: OperatorType<S>;
	private e: ElementType<S>;
	private mapping: MappingType<S, F>;
	private composition: CompositionType<F>;
	private id: IdType<F>;

	private _n: number;
	private size: number;
	private log: number;
	private d: S[];
	private lz: F[];

	private update(k: number): void {
		this.d[k] = this.op(this.d[2 * k], this.d[2 * k + 1]);
	}

	private all_apply(k: number, f: F): void {
		this.d[k] = this.mapping(f, this.d[k]);
		if (k < this.size) this.lz[k] = this.composition(f, this.lz[k]);
	}

	private push(k: number): void {
		this.all_apply(2 * k, this.lz[k]);
		this.all_apply(2 * k + 1, this.lz[k]);
		this.lz[k] = this.id();
	}

	constructor(
		op: OperatorType<S>,
		e: ElementType<S>,
		mapping: MappingType<S, F>,
		composition: CompositionType<F>,
		id: IdType<F>,
		x: number | S[] = 0
	) {
		this.op = op;
		this.e = e;
		this.mapping = mapping;
		this.composition = composition;
		this.id = id;

		if (typeof x === "number") {
			x = new Array<S>(x).fill(null as S).map(() => e());
		}
		this._n = x.length;
		this.size = bit_ceil(this._n);
		this.log = countr_zero(this.size);
		this.d = new Array<S>(2 * this.size).fill(null as S).map(() => e());
		this.lz = new Array<F>(this.size).fill(null as F).map(() => id());
		for (let i = 0; i < this._n; i++) this.d[this.size + i] = x[i];
		for (let i = this.size - 1; i >= 1; i--) {
			this.update(i);
		}
	}

	set(p: number, x: S): void {
		if (!(0 <= p && p < this._n)) {
			throw new Error("Out of range");
		}

		p += this.size;
		for (let i = this.log; i >= 1; i--) this.push(p >> i);
		this.d[p] = x;
		for (let i = 1; i <= this.log; i++) this.update(p >> i);
	}

	get(p: number): S {
		if (!(0 <= p && p < this._n)) {
			throw new Error("Out of range");
		}

		p += this.size;
		for (let i = this.log; i >= 1; i--) this.push(p >> i);
		return this.d[p];
	}

	prod(l: number, r: number): S {
		if (!(0 <= l && l <= r && r <= this._n)) {
			throw new Error("Out of range");
		}

		if (l === r) return this.e();

		l += this.size;
		r += this.size;

		for (let i = this.log; i >= 1; i--) {
			if ((l >> i) << i !== l) this.push(l >> i);
			if ((r >> i) << i !== r) this.push((r - 1) >> i);
		}

		let sml = this.e();
		let smr = this.e();
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

	apply(p: number, f: F): void; // (1)
	apply(l: number, r: number, f: F): void; // (2)

	apply(a: number, b: number | F, f?: F): void {
		if (f === undefined) {
			// (1)
			let p = a;
			const f = b as F;

			if (!(0 <= p && p < this._n)) {
				throw new Error("Out of range");
			}

			p += this.size;
			for (let i = this.log; i >= 1; i--) this.push(p >> i);
			this.d[p] = this.mapping(f, this.d[p]);
			for (let i = 1; i <= this.log; i++) this.update(p >> i);
		} else {
			// (2)
			let l = a;
			let r = b as number;
			f = f as F;

			if (!(0 <= l && l <= r && r <= this._n)) {
				throw new Error("Out of range");
			}

			if (l === r) return;

			l += this.size;
			r += this.size;

			for (let i = this.log; i >= 1; i--) {
				if ((l >> i) << i !== l) this.push(l >> i);
				if ((r >> i) << i !== r) this.push((r - 1) >> i);
			}

			{
				const l2 = l;
				const r2 = r;
				while (l < r) {
					if (l & 1) this.all_apply(l++, f);
					if (r & 1) this.all_apply(--r, f);
					l >>= 1;
					r >>= 1;
				}
				l = l2;
				r = r2;
			}

			for (let i = 1; i <= this.log; i++) {
				if ((l >> i) << i !== l) this.update(l >> i);
				if ((r >> i) << i !== r) this.update((r - 1) >> i);
			}
		}
	}

	max_right(l: number, g: SearchFunction<S>): number {
		if (!(0 <= l && l <= this._n)) {
			throw new RangeError("Out of range");
		}

		if (!g(this.e())) {
			throw new Error("g(e()) must be true.");
		}

		if (l === this._n) return this._n;
		l += this.size;
		for (let i = this.log; i >= 1; i--) this.push(l >> i);
		let sm = this.e();
		do {
			while (l % 2 === 0) l >>= 1;
			if (!g(this.op(sm, this.d[l]))) {
				while (l < this.size) {
					this.push(l);
					l = 2 * l;
					if (g(this.op(sm, this.d[l]))) {
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

	min_left(r: number, g: SearchFunction<S>): number {
		if (!(0 <= r && r <= this._n)) {
			throw new RangeError("Out of range");
		}

		if (!g(this.e())) {
			throw new Error("g(e()) must be true.");
		}

		if (r === 0) return 0;
		r += this.size;
		for (let i = this.log; i >= 1; i--) this.push((r - 1) >> i);
		let sm = this.e();
		do {
			r--;
			while (r > 1 && r % 2) r >>= 1;
			if (!g(this.op(this.d[r], sm))) {
				while (r < this.size) {
					this.push(r);
					r = 2 * r + 1;
					if (g(this.op(this.d[r], sm))) {
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
