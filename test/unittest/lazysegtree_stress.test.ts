import { LazySegtree } from "@/lazysegtree";
import { describe, test, expect } from "bun:test";
import { ok } from "node:assert";
import { randint, randpair } from "../utils/random";

class time_manager {
	v: Int32Array;
	constructor(n: number) {
		this.v = new Int32Array(n).fill(-1);
	}

	action(l: number, r: number, time: number) {
		for (let i = l; i < r; i++) {
			this.v[i] = time;
		}
	}

	prod(l: number, r: number) {
		let res = -1;
		for (let i = l; i < r; i++) {
			res = Math.max(res, this.v[i]);
		}
		return res;
	}
}

interface S {
	l: number;
	r: number;
	time: number;
}

interface T {
	new_time: number;
}

function op_ss(l: S, r: S): S {
	if (l.l === -1) return r;
	if (r.l === -1) return l;
	ok(l.r === r.l);
	return {
		l: l.l,
		r: r.r,
		time: Math.max(l.time, r.time),
	};
}

function op_ts(l: T, r: S): S {
	if (l.new_time === -1) return r;
	ok(r.time < l.new_time);
	return {
		l: r.l,
		r: r.r,
		time: l.new_time,
	};
}

function op_tt(l: T, r: T): T {
	if (l.new_time === -1) return r;
	if (r.new_time === -1) return l;
	ok(l.new_time > r.new_time);
	return l;
}

function e_s(): S {
	return {
		l: -1,
		r: -1,
		time: -1,
	};
}

function e_t(): T {
	return { new_time: -1 };
}

const seg = (x?: number | S[]) =>
	new LazySegtree<S, T>(op_ss, e_s, op_ts, op_tt, e_t, x);

describe("LazySegtreeStressTest", () => {
	test("NaiveTest", () => {
		for (let n = 1; n <= 30; n++) {
			for (let ph = 0; ph < 10; ph++) {
				const seg0 = seg(n);
				const tm = new time_manager(n);
				for (let i = 0; i < n; i++) {
					seg0.set(i, { l: i, r: i + 1, time: -1 });
				}
				let now = 0;
				for (let q = 0; q < 3000; q++) {
					const ty = randint(0, 3);
					const [l, r] = randpair(0, n);
					if (ty === 0) {
						const res = seg0.prod(l, r);
						expect(l).toEqual(res.l);
						expect(r).toEqual(res.r);
						expect(tm.prod(l, r)).toEqual(res.time);
					} else if (ty === 1) {
						const res = seg0.get(l);
						expect(l).toEqual(res.l);
						expect(l + 1).toEqual(res.r);
						expect(tm.prod(l, l + 1)).toEqual(res.time);
					} else if (ty === 2) {
						now++;
						seg0.apply(l, r, { new_time: now });
						tm.action(l, r, now);
					} else if (ty === 3) {
						now++;
						seg0.apply(l, { new_time: now });
						tm.action(l, l + 1, now);
					} else {
						ok(false);
					}
				}
			}
		}
	});

	test("MaxRightTest", () => {
		for (let n = 1; n <= 30; n++) {
			for (let ph = 0; ph < 10; ph++) {
				const seg0 = seg(n);
				const tm = new time_manager(n);
				for (let i = 0; i < n; i++) {
					seg0.set(i, {
						l: i,
						r: i + 1,
						time: -1,
					});
				}
				let now = 0;
				for (let q = 0; q < 1000; q++) {
					const ty = randint(0, 2);
					const [l, r] = randpair(0, n);
					if (ty === 0) {
						expect(
							seg0.max_right(l, (s) => {
								if (s.l === -1) return true;
								ok(s.l === l);
								ok(s.time === tm.prod(l, s.r));
								return s.r <= r;
							})
						);
					} else {
						now++;
						seg0.apply(l, r, { new_time: now });
						tm.action(l, r, now);
					}
				}
			}
		}
	});

	test("MinLeftTest", () => {
		for (let n = 1; n <= 30; n++) {
			for (let ph = 0; ph < 10; ph++) {
				const seg0 = seg(n);
				const tm = new time_manager(n);
				for (let i = 0; i < n; i++) {
					seg0.set(i, {
						l: i,
						r: i + 1,
						time: -1,
					});
				}
				let now = 0;
				for (let q = 0; q < 1000; q++) {
					const ty = randint(0, 2);
					const [l, r] = randpair(0, n);
					if (ty === 0) {
						expect(
							seg0.min_left(r, (s) => {
								if (s.l === -1) return true;
								ok(s.r === r);
								ok(s.time === tm.prod(s.l, r));
								return l <= s.l;
							})
						);
					} else {
						now++;
						seg0.apply(l, r, {
							new_time: now,
						});
						tm.action(l, r, now);
					}
				}
			}
		}
	});
});
