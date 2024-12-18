import { bit_ceil, countr_zero } from "@/internal_bit";
import { max_uint } from "../utils/limit";

describe("BitTest", () => {
	test("BitCeil", () => {
		expect(bit_ceil(0)).toEqual(1);
		expect(bit_ceil(1)).toEqual(1);
		expect(bit_ceil(2)).toEqual(2);
		expect(bit_ceil(3)).toEqual(4);
		expect(bit_ceil(4)).toEqual(4);
		expect(bit_ceil(5)).toEqual(8);
		expect(bit_ceil(6)).toEqual(8);
		expect(bit_ceil(7)).toEqual(8);
		expect(bit_ceil(8)).toEqual(8);
		expect(bit_ceil(9)).toEqual(16);
		expect(bit_ceil(2 ** 30)).toEqual(2 ** 30);
		expect(bit_ceil(2 ** 30 + 1)).toEqual(2 ** 31);
		expect(bit_ceil(2 ** 31 - 1)).toEqual(2 ** 31);
		expect(bit_ceil(2 ** 31)).toEqual(2 ** 31);
	});

	test("CountrZero", () => {
		expect(countr_zero(1)).toEqual(0);
		expect(countr_zero(2)).toEqual(1);
		expect(countr_zero(3)).toEqual(0);
		expect(countr_zero(4)).toEqual(2);
		expect(countr_zero(5)).toEqual(0);
		expect(countr_zero(6)).toEqual(1);
		expect(countr_zero(7)).toEqual(0);
		expect(countr_zero(8)).toEqual(3);
		expect(countr_zero(9)).toEqual(0);
		expect(countr_zero(2 ** 30)).toEqual(30);
		expect(countr_zero(2 ** 31 - 1)).toEqual(0);
		expect(countr_zero(2 ** 31)).toEqual(31);
		expect(countr_zero(max_uint)).toEqual(0);
	});
});
