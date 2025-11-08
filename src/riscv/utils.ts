export function bin(num: number, bits?: number) {
	let s = (num >>> 0).toString(2);
	if (!bits)
		return s;
	return "0".repeat(bits - s.length) + (num >>> 0).toString(2);
}

export function parseImmediate(imm: string): number {
	return Number.parseInt(imm.trim());
}