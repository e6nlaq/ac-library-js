import { DSU } from "@/dsu";

describe("DSUTest", () => {
	test("Zero", () => {
		const uf = new DSU(0);
		expect(uf.groups()).toEqual(new Array<number[]>());
	});

	test("Empty", () => {
		const uf = new DSU();
		expect(uf.groups()).toEqual(new Array<number[]>());
	});

	test("Assign", () => {
		let uf = new DSU();
		uf = new DSU(10);
	});

	test("Simple", () => {
		const uf = new DSU(2);
		expect(uf.same(0, 1)).toBeFalsy();

		const x = uf.merge(0, 1);
		expect(uf.leader(0)).toEqual(x);
		expect(uf.leader(1)).toEqual(x);

		expect(uf.same(0, 1)).toBeTruthy();
		expect(uf.size(0)).toEqual(2);
	});

	test("Line", () => {
		const n = 500000;
		const uf = new DSU(n);
		for (let i = 0; i < n - 1; i++) {
			uf.merge(i, i + 1);
		}

		expect(uf.size(0)).toEqual(n);
		expect(uf.groups().length).toEqual(1);
	});

	test("LineReverse", () => {
		const n = 500000;
		const uf = new DSU(n);
		for (let i = n - 2; i >= 0; i--) {
			uf.merge(i, i + 1);
		}

		expect(uf.size(0)).toEqual(n);
		expect(uf.groups().length).toEqual(1);
	});

	test("OutRange", () => {
		const uf = new DSU(0);

		expect(() => {
			uf.merge(0, 1);
		}).toThrowError();

		expect(() => {
			uf.same(0, 1);
		}).toThrowError();

		expect(() => {
			uf.size(0);
		}).toThrowError();
	});
});
