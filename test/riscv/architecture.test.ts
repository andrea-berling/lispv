import { bin } from "../../src/riscv/utils";
import { Instruction } from "../../src/riscv/instruction";
import { AddInstruction, SubInstruction } from "../../src/riscv/instructions/rtype"
import { JalrInstruction, LwInstruction, AddiInstruction } from "../../src/riscv/instructions/itype"
import { Registers } from "../../src/riscv/register";
import { Memory } from "../../src/riscv/memory";

describe('architecture', () => {
	test('register i0 hardwired to 0', () => {
		let r = Registers.get(0);
		try {
			r.value = 10;
			// impossible
			expect(true).toBe(false);
		} catch (e) {
		}
		expect(r.value).toBe(0);
	});

	test("memory alignments", () => {
		Memory.clean();

		let n = 0x12abcdef;
		Memory.set(0x0, n);

		// 12 ab cd ef

		expect(Memory.get(0x0, 1)).toBe(0x12);
		expect(Memory.get(0x0, 2)).toBe(0x12ab);
		expect(Memory.get(0x0, 4)).toBe(0x12abcdef);

		// ab cd ef 00

		// expect(Memory.get(0x1, 1)).toBe(0xab);
		// expect(Memory.get(0x1, 2)).toBe(0xabcd);
		expect(Memory.get(0x1, 4)).toBe(0xabcdef00);

		// cd ef 00 00

		expect(Memory.get(0x2, 1)).toBe(0xcd);
		expect(Memory.get(0x2, 2)).toBe(0xcdef);
		expect(Memory.get(0x2, 4)).toBe(0xcdef0000);

		// ef 00 00 00

		expect(Memory.get(0x3, 1)).toBe(0xef);
		expect(Memory.get(0x3, 2)).toBe(0xef00);
		expect(Memory.get(0x3, 4)).toBe(0xef000000);

		Memory.set(0x1, 0x67, 1);

		expect(Memory.get(0x1, 1)).toBe(0x67);
		expect(Memory.get(0x1, 2)).toBe(0x67cd);
		expect(Memory.get(0x1, 4)).toBe(0x67cdef00);

	})
});