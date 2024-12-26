import { inv_gcd, is_prime_constexpr } from "./internal_math";
import type { ll } from "./internal_types";

export function is_modint<M extends number>(x: unknown): x is ModInt<M> {
	return x instanceof ModInt;
}

export type Val<M extends number> = number | bigint | boolean | ModInt<M>;

export class ModInt<M extends number> {
	private m: M;
	private _v = 0;
	private umod() {
		return this.m;
	}
	private mint = (x: Val<M>) => new ModInt(this.m, x);

	private prime: boolean;

	constructor(m: M, v: Val<M> = 0) {
		this.m = m;
		this.prime = is_prime_constexpr(m);
		this.set(v);
	}

	mod(): number {
		return this.m;
	}

	static raw<T extends number>(m: T, v: number): ModInt<T> {
		const x = new ModInt(m);
		x._v = v;
		return x;
	}

	val() {
		return this._v;
	}

	/**
	 * `++x`
	 */
	inc() {
		this._v++;
		if (this._v === this.umod()) this._v = 0;
		return this.mint(this);
	}

	/**
	 * `--x`
	 */
	dec() {
		if (this._v === 0) this._v = this.umod();
		this._v--;
		return this.mint(this);
	}

	/**
	 * `x++`
	 */
	incp() {
		const v = this._v;
		this.inc();
		return ModInt.raw(this.m, v);
	}

	/**
	 * `x--`
	 */
	decp() {
		const v = this._v;
		this.dec();
		return ModInt.raw(this.m, v);
	}

	/**
	 * `+=`
	 */
	adda(r: Val<M>) {
		const rhs = new ModInt(this.m, r);
		this._v += rhs._v;
		if (this._v >= this.umod()) this._v -= this.umod();
		return this.mint(this);
	}

	/**
	 * `-=`
	 */
	suba(r: Val<M>) {
		const rhs = new ModInt(this.m, r);
		this._v -= rhs._v;
		if (this._v < 0) this._v += this.umod();
		return this.mint(this);
	}

	/**
	 * `*=`
	 */
	mula(r: Val<M>) {
		const rhs = new ModInt(this.m, r);
		let z = BigInt(this._v);
		z *= BigInt(rhs._v);
		this._v = Number(z % BigInt(this.umod()));
		return this.mint(this);
	}

	/**
	 * `/=`
	 */
	diva(r: Val<M>) {
		const rhs = new ModInt(this.m, r);
		this.mula(rhs.inv());
		return this.mint(this);
	}

	/**
	 * `-x`
	 */
	minus() {
		return this.mint(0).sub(this);
	}

	pow(n: ll) {
		n = BigInt(n);
		if (n < 0n) {
			throw new RangeError("n must be 0<=n");
		}

		const x = new ModInt(this.m, this);
		const r = new ModInt(this.m, 1);
		while (n) {
			if (n & 1n) r.mula(x);
			x.mula(x);
			n >>= 1n;
		}

		return r;
	}

	inv() {
		if (this.prime) {
			if (!this._v) {
				throw new Error();
			}
			return this.pow(this.umod() - 2);
		}

		const eg = inv_gcd(BigInt(this._v), BigInt(this.m));
		if (eg[0] !== 1n) {
			throw new RangeError("gcd(b.val(), mod) !== 1");
		}
		return new ModInt(this.m, eg[1]);
	}

	/**
	 * `+`
	 */
	add(r: Val<M>) {
		const rhs = this.mint(r);
		return this.mint(this).adda(rhs);
	}

	/**
	 * `-`
	 */
	sub(r: Val<M>) {
		const rhs = this.mint(r);
		return this.mint(this).suba(rhs);
	}

	/**
	 * `*`
	 */
	mul(r: Val<M>) {
		const rhs = this.mint(r);
		return this.mint(this).mula(rhs);
	}

	/**
	 * `/`
	 */
	div(r: Val<M>) {
		const rhs = this.mint(r);
		return this.mint(this).diva(rhs);
	}

	/**
	 * `===`
	 */
	eq(r: Val<M>) {
		const rhs = this.mint(r);
		return this._v === rhs._v;
	}

	/**
	 * `!==`
	 */
	nq(r: Val<M>) {
		const rhs = this.mint(r);
		return this._v !== rhs._v;
	}

	/**
	 * `=`
	 */
	set(v: Val<M>) {
		if (is_modint<M>(v)) {
			this._v = v._v;
		} else {
			v = BigInt(v);
			let x = v % BigInt(this.umod());
			if (x < 0n) x += BigInt(this.umod());
			this._v = Number(x);
		}
	}
}

export function modint<M extends number>(m: M) {
	return (x: Val<M> = 0) => new ModInt(m, x);
}

export const modint1000000007 = modint(1000000007);
export const modint998244353 = modint(998244353);
