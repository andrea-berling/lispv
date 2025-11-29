import { bin, flipEndianness, hex } from "../../src/riscv/utils";

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
})
