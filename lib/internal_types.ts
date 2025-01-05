import { isBigInt64Array, isBigUint64Array } from "node:util/types";

// Only use for function arguments
export type ll = bigint | number;
export type vll = BigInt64Array | bigint[];
export type vi = Int32Array | number[];
export type typevi =
	| Int8Array
	| Int16Array
	| Int32Array
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array;
export type typevll = BigInt64Array | BigUint64Array;
export type vnum = number[] | bigint[] | typevi | typevll;

export function to_array(v: vnum): number[] | bigint[] {
	if (Array.isArray(v)) {
		return v;
	}

	if (isBigInt64Array(v) || isBigUint64Array(v)) {
		return [...v];
	}

	return [...v];
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Constructor<T> = (arg: any) => T;

// Segtree

export type OperatorType<S> = (a: S, b: S) => S;
export type ElementType<S> = () => S;
export type SearchFunction<S> = (x: S) => boolean;
export type MappingType<S, F> = (f: F, x: S) => S;
export type CompositionType<F> = (f: F, g: F) => F;
export type IdType<F> = () => F;
