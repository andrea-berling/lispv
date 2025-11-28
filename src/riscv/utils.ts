/**
 * @param num the `number` to represent in binary form
 * @param bits the optional `number` of binary digits to print, so the 
 * @returns a `string` that is the binary representation of `num`
 */
export function bin(num: number, bits?: number): string {
	let s = (num >>> 0).toString(2);
	if (!bits)
		return s;
	return "0".repeat(bits - s.length) + (num >>> 0).toString(2);
}

/**
 * @param n the `number` to hex.
 * @returns the hexadecimal representation of `n`, treated as **unsigned**.
 */
export function hex(n: number) {
	return "0x" + (n >>> 0).toString(16).padStart(8, '0'); // Unsigned per hex
}