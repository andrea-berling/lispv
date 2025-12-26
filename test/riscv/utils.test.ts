import { bin, flipEndianness, hex, unsigned } from "../../src/riscv/utils";

describe("utils", () => {
	test('bin', () => {
		expect(bin(0b101010) == "101010");
	});

	test('hex', () => {
		expect(hex(255)).toBe("0x000000ff");
		expect(hex(4294967295)).toBe("0xffffffff");
	});

	test('endianness flipping', () => {
		let n = 0x12abcdef;
		expect(n).toBe(flipEndianness(flipEndianness(n)));
	});

	test('unsigned comparison', () => {
		let n1 = -1;
		let n2 = 0x0fff_ffff;
		expect(n1).toBeLessThan(n2);
		expect(unsigned(n1)).toBeGreaterThan(unsigned(n2));
	});
})
