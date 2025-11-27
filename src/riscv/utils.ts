export function bin(num: number, bits?: number) {
	let s = (num >>> 0).toString(2);
	if (!bits)
		return s;
	return "0".repeat(bits - s.length) + (num >>> 0).toString(2);
}

export function parseImmediate(imm: string): number {
	return Number.parseInt(imm.trim());
}

/**
 * 
 * @param n the `number` to hex.
 * @returns the hexadecimal representation of `n`, treated as **unsigned**.
 */
export function hex(n: number) {
	return (n | 0 >>> 0).toString(16).padStart(8, '0'); // Unsigned per hex
}