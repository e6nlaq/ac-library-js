import { ModInt, modint } from "@/modint";
import { max_int } from "../utils/limit";

function gcd(a: number, b: number): number {
	if (b === 0) return a;
	return gcd(b, a % b);
}

describe("ModIntTest", () => {
	test("DynamicBorder", () => {
		const mod_upper = max_int;
		for (let mod = mod_upper; mod >= mod_upper - 20; mod--) {
			const mint = modint(mod);
			const v: bigint[] = [];
			const M = BigInt(mod);
			for (let i = 0n; i < 6n; i++) {
				v.push(i);
				v.push(M - i);
				v.push(M / 2n + i);
				v.push(M / 2n - i);
			}

			for (const a of v) {
				expect(mint(a).pow(3).val()).toEqual(Number(a ** 3n % M));
				for (const b of v) {
					expect(mint(a).add(b).val()).toEqual(Number((a + b) % M));
					expect(mint(a).sub(b).val()).toEqual(Number((a - b + M) % M));
					expect(mint(a).mul(b).val()).toEqual(Number((a * b) % M));
				}
			}
		}
	});

	test("Mod1", () => {
		const mint = modint(1);
		for (let i = 0; i < 100; i++) {
			for (let j = 0; j < 100; j++) {
				expect(mint(i).mul(j).val()).toEqual(0);
			}
		}

		expect(mint(1234).add(5678).val()).toEqual(0);
		expect(mint(1234).sub(5678).val()).toEqual(0);
		expect(mint(1234).mul(5678).val()).toEqual(0);
		expect(mint(1234).pow(5678).val()).toEqual(0);

		expect(mint(0).inv().val()).toEqual(0);
		expect(mint(1).val()).toEqual(0);
	});

	test("ModIntMax", () => {
		const mint = modint(max_int);
		for (let i = 0; i < 100; i++) {
			for (let j = 0; j < 100; j++) {
				expect(mint(i).mul(j).val()).toEqual(i * j);
			}
		}

		expect(mint(1234).add(5678).val()).toEqual(1234 + 5678);
		expect(mint(1234).sub(5678).val()).toEqual(max_int - 5678 + 1234);
		expect(mint(1234).mul(5678).val()).toEqual(1234 * 5678);

		expect(mint(max_int).add(max_int).val()).toEqual(0);
	});

	test("Inv", () => {
		for (let i = 1; i < 10; i++) {
			const x = new ModInt(11, i).inv().val();
			expect((x * i) % 11).toEqual(1);
		}

		for (let i = 1; i < 11; i++) {
			if (gcd(i, 12) !== 1) continue;
			const x = new ModInt(12, i).inv().val();
			expect((x * i) % 12).toEqual(1);
		}

		for (let i = 1; i < 1000; i++) {
			const m = 1000000007;
			const x = new ModInt(m, i).inv().val();
			expect((x * i) % m).toEqual(1);
		}

		for (let i = 1; i < 1000; i++) {
			const m = 1000000008;
			if (gcd(i, m) !== 1) continue;
			const x = new ModInt(m, i).inv().val();
			expect((x * i) % m).toEqual(1);
		}

		for (let i = 1; i < 1000; i++) {
			const m = 998244353;
			const x = new ModInt(m, i).inv().val();
			expect(0).toBeLessThanOrEqual(x);
			expect(m - 1).toBeGreaterThanOrEqual(x);
			expect((x * i) % m).toEqual(1);
		}

		for (let i = 1; i < 1000; i++) {
			const m = max_int;
			if (gcd(i, m) !== 1) continue;
			const x = new ModInt(m, i).inv().val();
			expect((x * i) % m).toEqual(1);
		}
	});

	test("Increment", () => {
		const mint = modint(11);
		const a = mint();
		a.set(8);
		expect(a.inc().val()).toEqual(9);
		expect(a.inc().val()).toEqual(10);
		expect(a.inc().val()).toEqual(0);
		expect(a.inc().val()).toEqual(1);

		a.set(3);
		expect(a.dec().val()).toEqual(2);
		expect(a.dec().val()).toEqual(1);
		expect(a.dec().val()).toEqual(0);
		expect(a.dec().val()).toEqual(10);

		a.set(8);
		expect(a.incp().val()).toEqual(8);
		expect(a.incp().val()).toEqual(9);
		expect(a.incp().val()).toEqual(10);
		expect(a.incp().val()).toEqual(0);
		expect(a.val()).toEqual(1);

		a.set(3);
		expect(a.decp().val()).toEqual(3);
		expect(a.decp().val()).toEqual(2);
		expect(a.decp().val()).toEqual(1);
		expect(a.decp().val()).toEqual(0);
		expect(a.val()).toEqual(10);
	});

	test("StaticUsage", () => {
		const mint = modint(11);
		expect(mint().mod()).toEqual(11);
		expect(mint(4).val()).toEqual(4);
		expect(mint(4).minus().val()).toEqual(7);

		expect(mint(1).eq(mint(3))).toBeFalsy();
		expect(mint(1).nq(mint(3))).toBeTruthy();

		expect(mint(1).eq(mint(12))).toBeTruthy();
		expect(mint(1).nq(mint(12))).toBeFalsy();

		expect(() => mint(3).pow(-1)).toThrow();
	});

	test("Constructor", () => {
		const mint = modint(11);
		expect(1).toEqual(mint(true).val());
		expect(3).toEqual(mint(3).val());
		expect(3).toEqual(mint(3n).val());
		expect(3).toEqual(mint(mint(3)).val());

		expect(1).toEqual(mint(-10).val());
		expect(1).toEqual(mint(-10n).val());

		expect(2).toEqual(mint(1).add(mint(1).val()).val());

		const m = mint();
		expect(0).toEqual(m.val());
	});
});
