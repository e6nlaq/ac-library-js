import { pow_mod_constexpr } from "@/internal_math";
import { ok } from "node:assert";

export function factors(m: number): number[] {
	const result: number[] = [];
	for (let i = 2; BigInt(i) ** 2n <= BigInt(m); i++) {
		if (m % i === 0) {
			result.push(i);
			while (m % i === 0) {
				m = Math.floor(m / i);
			}
		}
	}
	if (m > 1) {
		result.push(m);
	}
	return result;
}

export function is_primitive_root(m: number, g: number): boolean {
	ok(1 <= g && g < m);
	const fac = factors(m - 1);
	for (const x of fac) {
		if (
			pow_mod_constexpr(BigInt(g), (BigInt(m) - 1n) / BigInt(x), BigInt(m)) ===
			1n
		)
			return false;
	}
	return true;
}
