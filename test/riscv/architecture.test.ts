import { bin } from "../../src/riscv/utils";
import { Instruction } from "../../src/riscv/instruction";
import { AddInstruction, SubInstruction } from "../../src/riscv/instructions/rtype"
import { JalrInstruction, LwInstruction, AddiInstruction } from "../../src/riscv/instructions/itype"
import { Registers } from "../../src/riscv/register";
import { Memory } from "../../src/riscv/peripherals";

describe('architecture', () => {
	test('register i0 hardwired to 0', () => {
		let r = Registers.get(0);
		r.value = 10;
		expect( r.value == 0);
	});
});