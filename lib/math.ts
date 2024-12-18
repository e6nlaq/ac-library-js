import { ok } from "node:assert";
import {
	Barrett,
	floor_sum_unsigned,
	inv_gcd,
	safe_mod,
} from "./internal_math";
import type { ll, vll } from "./internal_types";

export function pow_mod(x: ll, n: ll, m: number): bigint {
	x = BigInt(x);
	n = BigInt(n);

	ok(0n <= n && 1 <= m);
	if (m === 1) return 0n;
	const bt = new Barrett(m);
	let r = 1;
	let y = Number(safe_mod(x, BigInt(m)));
	while (n) {
		if (n & 1n) r = bt.mul(r, y);
		y = bt.mul(y, y);
		n >>= 1n;
	}

	return BigInt(r);
}

export function inv_mod(x: ll, m: ll): bigint {
	x = BigInt(x);
	m = BigInt(m);
	ok(1n <= m);
	const z = inv_gcd(x, m);
	ok(z[0] === 1n);
	return z[1];
}

export function crt(r: vll, m: vll): [bigint, bigint] {
	if (Array.isArray(r)) r = new BigInt64Array(r);
	if (Array.isArray(m)) m = new BigInt64Array(m);

	ok(r.length === m.length);
	const n = Number(r.length);

	let r0 = 0n;
	let m0 = 1n;
	for (let i = 0; i < n; i++) {
		ok(1n <= m[i]);
		let r1 = safe_mod(r[i], m[i]);
		let m1 = m[i];
		if (m0 < m1) {
			[r0, r1] = [r1, r0];
			[m0, m1] = [m1, m0];
		}
		if (m0 % m1 === 0n) {
			if (r0 % m1 !== r1) return [0n, 0n];
			continue;
		}

		const [g, im] = inv_gcd(m0, m1);
		const u1 = m1 / g;

		if ((r1 - r0) % g) return [0n, 0n];

		const x = ((((r1 - r0) / g) % u1) * im) % u1;

		r0 += x * m0;
		m0 *= u1;
		if (r0 < 0n) r0 += m0;
	}

	return [r0, m0];
}

export function floor_sum(n: ll, m: ll, a: ll, b: ll): bigint {
	n = BigInt(n);
	m = BigInt(m);
	a = BigInt(a);
	b = BigInt(b);

	ok(0n <= n && n < 1n << 32n);
	ok(0n <= m && m < 1n << 32n);
	let ans = 0n;
	if (a < 0n) {
		const a2 = safe_mod(a, m);
		ans -= ((n * (n - 1n)) / 2n) * ((a2 - a) / m);
		a = a2;
	}
	if (b < 0n) {
		const b2 = safe_mod(b, m);
		ans -= n * ((b2 - b) / m);
		b = b2;
	}

	return ans + floor_sum_unsigned(n, m, a, b);
}
