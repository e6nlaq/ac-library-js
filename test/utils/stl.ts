// ref: https://tech-blog.s-yoshiki.com/entry/245

export function next_permutation<T>(arr: T[]): boolean {
	for (let i = arr.length - 2; i >= 0; i--) {
		if (arr[i] < arr[i + 1]) {
			for (let j = arr.length - 1; j > i; j--) {
				if (arr[j] > arr[i]) {
					[arr[i], arr[j]] = [arr[j], arr[i]];
					const len = (arr.length - (i + 1)) >> 1;
					for (let k = 0; k < len; k++) {
						[arr[i + 1 + k], arr[arr.length - 1 - k]] = [
							arr[arr.length - 1 - k],
							arr[i + 1 + k],
						];
					}
					return true;
				}
			}
		}
	}
	return false;
}
