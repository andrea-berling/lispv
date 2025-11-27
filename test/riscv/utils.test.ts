import { bin, hex } from "../../src/riscv/utils";

test('bin', () => {
	expect(bin(0b101010) == "101010");
});

test('hex', () => {
	expect(hex(255)).toBe("0x000000ff");
	expect(hex(4294967295)).toBe("0xffffffff");
});