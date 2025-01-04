import { isBigInt64Array, isBigUint64Array } from "node:util/types";

// Only use for function arguments
export type ll = bigint | number;
export type vll = BigInt64Array | bigint[];
export type vi = Int32Array | number[];
export type vnum =
	| number[]
	| bigint[]
	| Int8Array
	| Int16Array
	| Int32Array
	| BigInt64Array
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array
	| BigInt64Array;

export function to_array(v: vnum): number[] | bigint[] {
	if (Array.isArray(v)) {
		return v;
	}

	if (isBigInt64Array(v) || isBigUint64Array(v)) {
		return [...v];
	}

	return [...v];
}

// Segtree

export type OperatorType<S> = (a: S, b: S) => S;
export type ElementType<S> = () => S;
export type SearchFunction<S> = (x: S) => boolean;
export type MappingType<S, F> = (f: F, x: S) => S;
export type CompositionType<F> = (f: F, g: F) => F;
export type IdType<F> = () => F;
