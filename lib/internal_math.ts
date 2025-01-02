export function safe_mod(x: bigint, m: bigint): bigint {
	x %= m;
	if (x < 0n) x += m;
	return x;
}

export class Barrett {
	private readonly _m: number;

	// private readonly im: bigint;

	constructor(m: number) {
		if (m <= 0) throw new Error("m must be positive");
		this._m = m;
		// this.im = (2n ** 64n - 1n) / BigInt(m) + 1n;
	}

	umod(): number {
		return this._m;
	}

	mul(a: number, b: number): number {
		return Number((BigInt(a) * BigInt(b)) % BigInt(this._m));
		// const z = BigInt(a) * BigInt(b);
		// const x = (z * this.im) / 2n ** 64n;
		// const y = x * BigInt(this._m);
		// return Number(z - y + (z < y ? BigInt(this._m) : 0n));
	}
}

export function pow_mod_constexpr(x: bigint, n: bigint, m: bigint): bigint {
	if (m === 1n) return 0n;
	x = safe_mod(x, m);
	let r = 1n;
	let y = x;
	while (n > 0n) {
		if (n & 1n) r = (r * y) % m;
		y = (y * y) % m;
		n >>= 1n;
	}
	return r;
}

export function is_prime_constexpr(n: number): boolean {
	if (n <= 1) return false;
	if (n === 2 || n === 7 || n === 61) return true;
	if (n % 2 === 0) return false;

	let d = n - 1;
	while (d % 2 === 0) d /= 2;

	const bases = new Uint8Array([2, 7, 61]);
	for (const a of bases) {
		let t = d;
		let y = pow_mod_constexpr(BigInt(a), BigInt(t), BigInt(n));
		while (t !== n - 1 && y !== 1n && y !== BigInt(n - 1)) {
			y = (y * y) % BigInt(n);
			t *= 2;
		}
		if (y !== BigInt(n - 1) && t % 2 === 0) {
			return false;
		}
	}
	return true;
}
export const is_prime = is_prime_constexpr;

export function inv_gcd(a: bigint, b: bigint): [bigint, bigint] {
	a = ((a % b) + b) % b;

	if (a === 0n) {
		return [b, 0n];
	}

	let s = b;
	let t = a;
	let m0 = 0n;
	let m1 = 1n;
	while (t !== 0n) {
		const u = s / t;
		s -= t * u;
		m0 -= m1 * u;

		let tmp = s;
		s = t;
		t = tmp;
		tmp = m0;
		m0 = m1;
		m1 = tmp;
	}

	if (m0 < 0) {
		m0 += b / s;
	}
	return [s, m0];
}

export function primitive_root_constexpr(m: number): number {
	if (m === 2) return 1;
	if (m === 167772161 || m === 469762049 || m === 998244353) return 3;
	if (m === 754974721) return 11;

	const divs = new Int32Array(20);
	divs[0] = 2;
	let cnt = 1;
	let x = (m - 1) / 2;
	while (x % 2 === 0) {
		x /= 2;
	}

	for (let i = 3; i * i <= x; i += 2) {
		if (x % i === 0) {
			divs[cnt++] = i;
			while (x % i === 0) {
				x /= i;
			}
		}
	}

	if (x > 1) {
		divs[cnt++] = x;
	}

	for (let g = 2; ; g++) {
		let ok = true;
		for (let i = 0; i < cnt; i++) {
			if (
				pow_mod_constexpr(
					BigInt(g),
					BigInt(m - 1) / BigInt(divs[i]),
					BigInt(m)
				) === 1n
			) {
				ok = false;
				break;
			}
		}
		if (ok) return g;
	}
}
export const primitive_root = primitive_root_constexpr;

export function floor_sum_unsigned(
	n: bigint,
	m: bigint,
	a: bigint,
	b: bigint
): bigint {
	let ans = 0n;
	while (true) {
		if (a >= m) {
			ans += ((n * (n - 1n)) / 2n) * (a / m);
			a %= m;
		}
		if (b >= m) {
			ans += n * (b / m);
			b %= m;
		}

		const y_max = a * n + b;
		if (y_max < m) break;

		n = y_max / m;
		b = y_max % m;

		[m, a] = [a, m];
	}
	return ans;
}
