import { bin, hex } from "../../src/riscv/utils";
import { Instruction } from "../../src/riscv/instruction";
import { AddInstruction, SubInstruction } from "../../src/riscv/instructions/rtype"
import { JalrInstruction, LwInstruction, AddiInstruction } from "../../src/riscv/instructions/itype"
import { Registers } from "../../src/riscv/register";
import { Memory } from "../../src/riscv/memory";
import { ProgramCounter } from "../../src/riscv/program_counter";
import { SwInstruction } from "../../src/riscv/instructions/stype";
import { Pipeline } from "../../src/riscv//pipeline";
import { Immediate12 } from "../../src/riscv/immediate";
import { Assembler } from "../../src/riscv/assembler"
import { InstructionRegistry } from "../../src/riscv/instructionRegistry";

// side effect imports
import "../../src/riscv/instructions/btype"
import "../../src/riscv/instructions/itype"
import "../../src/riscv/instructions/jtype"
import "../../src/riscv/instructions/rtype"
import "../../src/riscv/instructions/stype"
import "../../src/riscv/instructions/utype"

describe('assembling', () => {
	test('assemble string and run', () => {

		Pipeline.init();

		let instructions = `
		addi i1, i0, 0xff
		add i2, i1, i1 # i2 = 0x1fe
		addi i3, i0, 0xff # i3 is the address we will store the result i2
		sw i2, 0x0(i3)
		`

		Assembler.parse(instructions.split("\n"));

		Pipeline.run();

		expect(Memory.get(0xff)).toBe(0x1fe);
	});

	test('loop tags', () => {

		Pipeline.init();

		let instructions = `
		addi i10, i0, 0
		addi i11, i0, 1
		addi i1, i0, 10 # i1 = 10
		loop:
		addi i1, i1, -1
		add i12, i0, i10
		add i10, i10, i11
		add i11, i12, i11
		bne i1, i0, 0xc # while i1 > 0
		`

		Assembler.parse(instructions.split("\n"));

		Pipeline.run();

		Registers.show();
	});

});