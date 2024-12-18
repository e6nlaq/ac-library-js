export class simple_queue<T> {
	payload: T[] = [];
	pos = 0;

	size(): number {
		return this.payload.length - this.pos;
	}

	empty(): boolean {
		return this.pos === this.payload.length;
	}

	push(t: T): void {
		this.payload.push(t);
	}

	front(): T {
		return this.payload[this.pos];
	}

	clear(): void {
		this.payload = [];
		this.pos = 0;
	}

	pop(): void {
		this.pos++;
	}
}
