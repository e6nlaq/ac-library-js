// Only use for function arguments

import { isBigInt64Array, isBigUint64Array } from "node:util/types";

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
