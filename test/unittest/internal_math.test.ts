import { describe, expect, test } from "bun:test";
import {
	Barrett,
	inv_gcd,
	is_prime_constexpr,
	primitive_root_constexpr,
	safe_mod,
} from "@/internal_math";
import { max_ll, min_ll } from "../utils/limit";
import { is_primitive_root } from "../utils/math";

function gcd(a: bigint, b: bigint): bigint {
	if (a < 0n || b < 0n) throw new RangeError();
	if (b === 0n) return a;
	return gcd(b, a % b);
}

function is_prime_naive(n: number): boolean {
	if (n === 0 || n === 1) return false;
	for (let i = 2; i * i <= n; i++) {
		if (n % i === 0) return false;
	}
	return true;
}

describe("InternalMathTest", () => {
	test("Barrett", () => {
		for (let m = 1; m <= 100; m++) {
			const bt = new Barrett(m);
			for (let a = 0; a < m; a++) {
				for (let b = 0; b < m; b++) {
					expect(bt.mul(a, b)).toEqual((a * b) % m);
				}
			}
		}

		const bt = new Barrett(1);
		expect(bt.mul(0, 0)).toEqual(0);
	});

	test("BarrettIntBorder", () => {
		const mod_upper = Number.MAX_SAFE_INTEGER;
		for (let mod = BigInt(mod_upper); mod >= BigInt(mod_upper) - 20n; mod--) {
			const bt = new Barrett(Number(mod));
			const v: bigint[] = [];
			for (let i = 0n; i < 10n; i++) {
				v.push(i);
				v.push(mod - i);
				v.push(mod / 2n + i);
				v.push(mod / 2n - i);
			}

			for (const a of v) {
				const a2 = a;
				const numa = Number(a);
				expect(bt.mul(numa, bt.mul(numa, numa))).toEqual(
					Number((((a2 * a2) % mod) * a2) % mod)
				);

				for (const b of v) {
					const b2 = b;
					expect(bt.mul(numa, Number(b))).toEqual(Number((a2 * b2) % mod));
				}
			}
		}
	});

	test("IsPrime", () => {
		expect(is_prime_constexpr(121)).toBeFalsy();
		expect(is_prime_constexpr(11 * 13)).toBeFalsy();
		expect(is_prime_constexpr(1000000007)).toBeTruthy();
		expect(is_prime_constexpr(1000000008)).toBeFalsy();
		expect(is_prime_constexpr(1000000009)).toBeTruthy();

		for (let i = 0; i <= 10000; i++) {
			expect(is_prime_constexpr(i)).toEqual(is_prime_naive(i));
		}

		for (let i = 0; i <= 10000; i++) {
			const x = 2 ** 31 - i;
			expect(is_prime_constexpr(x)).toEqual(is_prime_naive(x));
		}
	});

	test("SafeMod", () => {
		const preds: bigint[] = [];
		for (let i = 0n; i <= 100n; i++) {
			preds.push(i);
			preds.push(-i);
			preds.push(i);
			preds.push(2n ** 64n + i);
			preds.push(2n ** 64n - i);
		}

		for (const a of preds) {
			for (const b of preds) {
				if (b <= 0) continue;
				const ans = ((a % b) + b) % b;
				expect(safe_mod(a, b)).toEqual(ans);
			}
		}
	});

	test("InvGcdBound", () => {
		const pred: bigint[] = [];
		for (let i = 0n; i <= 10n; i++) {
			pred.push(i);
			pred.push(-i);
			pred.push(min_ll + i);
			pred.push(max_ll - i);

			pred.push(min_ll / 2n + i);
			pred.push(min_ll / 2n - i);
			pred.push(max_ll / 2n + i);
			pred.push(max_ll / 2n - i);

			pred.push(min_ll / 3n + i);
			pred.push(min_ll / 3n - i);
			pred.push(max_ll / 3n + i);
			pred.push(max_ll / 3n - i);
		}

		pred.push(998244353n);
		pred.push(1000000007n);
		pred.push(1000000009n);
		pred.push(-998244353n);
		pred.push(-1000000007n);
		pred.push(-1000000009n);

		for (const a of pred) {
			for (const b of pred) {
				if (b <= 0n) continue;
				const a2 = safe_mod(a, b);
				const eg = inv_gcd(a, b);
				const g = gcd(a2, b);
				expect(eg[0]).toEqual(g);
				expect(0n).toBeLessThanOrEqual(eg[1]);
				expect(eg[1]).toBeLessThanOrEqual(b / eg[0]);
				expect(g % b).toEqual((eg[1] * a2) % b);
			}
		}
	});

	test("PrimitiveRootTestNaive", () => {
		for (let m = 2; m <= 5000; m++) {
			if (!is_prime_constexpr(m)) continue;
			const n = primitive_root_constexpr(m);
			expect(1).toBeLessThanOrEqual(n);
			expect(n).toBeLessThan(m);
			let x = 1;
			for (let i = 1; i <= m - 2; i++) {
				x = Number((BigInt(x) * BigInt(n)) % BigInt(m));
				expect(x).not.toEqual(1);
			}
			x = Number((BigInt(x) * BigInt(n)) % BigInt(m));
			expect(x).toEqual(1);
		}
	});

	test("PrimitiveRootTest", () => {
		for (let i = 0; i < 1000; i++) {
			const x = 2 ** 31 - i;
			if (!is_prime_constexpr(x)) continue;
			expect(is_primitive_root(x, primitive_root_constexpr(x))).toBeTruthy();
		}
	});
});
