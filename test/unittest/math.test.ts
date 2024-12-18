import { safe_mod } from "@/internal_math";
import { crt, floor_sum, inv_mod, pow_mod } from "@/math";
import { ok } from "node:assert";
import { max_ll, min_ll } from "../utils/limit";

function gcd(a: bigint, b: bigint): bigint {
	ok(0n <= a && 0n <= b);
	if (b === 0n) return a;
	return gcd(b, a % b);
}

function floor_sum_naive(n: bigint, m: bigint, a: bigint, b: bigint): bigint {
	let sum = 0n;
	for (let i = 0n; i < n; i++) {
		const z = a * i + b;
		sum += (z - safe_mod(z, m)) / m;
	}
	return sum;
}

describe("MathTest", () => {
	test("PowMod", () => {
		const naive = (x: bigint, n: bigint, mod: bigint): bigint => {
			const y = safe_mod(x, mod);
			let z = 1n % mod;
			for (let i = 0n; i < n; i++) {
				z = (z * y) % mod;
			}
			return z;
		};

		for (let a = -50n; a < 50n; a++) {
			for (let b = 0n; b <= 30n; b++) {
				for (let c = 1; c <= 30; c++) {
					expect(pow_mod(a, b, c)).toEqual(naive(a, b, BigInt(c)));
				}
			}
		}
	});

	test("InvBoundHand", () => {
		expect(inv_mod(-1, max_ll)).toEqual(inv_mod(min_ll, max_ll));
		expect(inv_mod(max_ll, max_ll - 1n)).toEqual(1n);
		expect(inv_mod(max_ll - 1n, max_ll)).toEqual(max_ll - 1n);
		expect(inv_mod(max_ll / 2n + 1n, max_ll)).toEqual(2n);
	});

	test("InvMod", () => {
		for (let a = -100n; a <= 100n; a++) {
			for (let b = 1n; b <= 1000n; b++) {
				if (gcd(safe_mod(a, b), b) !== 1n) continue;
				const c = inv_mod(a, b);
				expect(0).toBeLessThanOrEqual(c);
				expect(c).toBeLessThan(b);
				expect(1n % b).toEqual((((a * c) % b) + b) % b);
			}
		}
	});

	test("InvModZero", () => {
		expect(inv_mod(0, 1)).toEqual(0n);
		for (let i = 0n; i < 10n; i++) {
			expect(0n).toEqual(inv_mod(i, 1));
			expect(0n).toEqual(inv_mod(-i, 1));
			expect(0n).toEqual(inv_mod(min_ll + i, 1));
			expect(0n).toEqual(inv_mod(max_ll - i, 1));
		}
	});

	test("FloorSum", () => {
		for (let n = 0; n < 10; n++) {
			for (let m = 1; m < 10; m++) {
				for (let a = -10; a < 10; a++) {
					for (let b = -10; b < 10; b++) {
						expect(floor_sum(n, m, a, b)).toEqual(
							floor_sum_naive(BigInt(n), BigInt(m), BigInt(a), BigInt(b))
						);
					}
				}
			}
		}
	});

	test("CRTHand", () => {
		const res = crt([1n, 2n, 1n], [2n, 3n, 2n]);
		expect(res[0]).toEqual(5n);
		expect(res[1]).toEqual(6n);
	});

	test("CRT2", () => {
		for (let a = 1n; a <= 20n; a++) {
			for (let b = 1n; b <= 20n; b++) {
				for (let c = -10n; c <= 10n; c++) {
					for (let d = -10n; d <= 10n; d++) {
						const res = crt([c, d], [a, b]);
						if (res[1] === 0n) {
							for (let x = 0n; x < (a * b) / gcd(a, b); x++) {
								expect(x % a !== c || x % b !== d).toBeTruthy();
							}
							continue;
						}
						expect(res[1]).toEqual((a * b) / gcd(a, b));
						expect(res[0] % a).toEqual(safe_mod(c, a));
						expect(res[0] % b).toEqual(safe_mod(d, b));
					}
				}
			}
		}
	});

	test("CRT3", () => {
		for (let a = 1n; a <= 5n; a++) {
			for (let b = 1n; b <= 5n; b++) {
				for (let c = 1n; c <= 5n; c++) {
					for (let d = -5n; d <= 5n; d++) {
						for (let e = -5n; e <= 5n; e++) {
							for (let f = -5n; f <= 5n; f++) {
								const res = crt([d, e, f], [a, b, c]);
								let lcm = (a * b) / gcd(a, b);
								lcm = (lcm * c) / gcd(lcm, c);
								if (res[1] === 0n) {
									for (let x = 0n; x < lcm; x++) {
										expect(
											x % a !== d || x % b !== e || x % c !== f
										).toBeTruthy();
									}
									continue;
								}
								expect(res[1]).toEqual(lcm);
								expect(res[0] % a).toEqual(safe_mod(d, a));
								expect(res[0] % b).toEqual(safe_mod(e, b));
								expect(res[0] % c).toEqual(safe_mod(f, c));
							}
						}
					}
				}
			}
		}
	});
});
