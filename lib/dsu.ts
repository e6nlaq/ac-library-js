export class DSU {
	private _n: number;
	private parent_or_size: Int32Array;

	constructor(n = 0) {
		this._n = n;
		this.parent_or_size = new Int32Array(n).fill(-1);
	}

	merge(a: number, b: number): number {
		this.assertInRange(a);
		this.assertInRange(b);
		let x = this.leader(a);
		let y = this.leader(b);
		if (x === y) return x;
		if (-this.parent_or_size[x] < -this.parent_or_size[y]) {
			[x, y] = [y, x];
		}
		this.parent_or_size[x] += this.parent_or_size[y];
		this.parent_or_size[y] = x;
		return x;
	}

	same(a: number, b: number): boolean {
		this.assertInRange(a);
		this.assertInRange(b);
		return this.leader(a) === this.leader(b);
	}

	leader(a: number): number {
		this.assertInRange(a);
		if (this.parent_or_size[a] < 0) return a;

		this.parent_or_size[a] = this.leader(this.parent_or_size[a]);
		return this.parent_or_size[a];
	}

	size(a: number): number {
		this.assertInRange(a);
		return -this.parent_or_size[this.leader(a)];
	}

	groups(): number[][] {
		const leaderBuf = new Int32Array(this._n).map((_, i) => this.leader(i));
		const groupSize = new Int32Array(this._n);

		for (const leader of leaderBuf) {
			groupSize[leader]++;
		}

		const result: number[][] = Array.from({ length: this._n }, () => []);
		for (let i = 0; i < this._n; i++) {
			result[leaderBuf[i]].push(i);
		}
		return result.filter((group) => group.length > 0);
	}

	private assertInRange(a: number): void {
		if (a < 0 || a >= this._n) {
			throw new RangeError(`Index ${a} is out of range`);
		}
	}
}
