// Only use for function arguments

export type ll = bigint | number;
export type vll = BigInt64Array | bigint[];

export interface WritableArray<T> {
	[n: number]: T;
	readonly length: number;
}

export interface WritableArrayConstructor<V, T extends WritableArray<V>> {
	new (length: number): T;
	new (array: V[]): T;
}

export interface TypedArrayConstructor<V> extends ArrayConstructor {
	new (n: number): WritableArray<V>;
}

export interface CustomArrayOption<V, T extends WritableArray<V>> {
	arr: WritableArrayConstructor<V, T> | TypedArrayConstructor<V>;
}
