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
});