export function bit_ceil(n: number): number {
	let x = 1;
	while (x < n) x *= 2;

	return x;
}

export function countr_zero(n: number): number {
	if (n === 0) return Math.floor(Math.log2(Number.MAX_SAFE_INTEGER));

	let ans = 0;
	while (!(n & 1)) {
		ans++;
		n >>= 1;
	}
	return ans;
}
export const countr_zero_constexpr = countr_zero;
