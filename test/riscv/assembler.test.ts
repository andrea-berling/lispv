import { bin } from "../../src/riscv/utils";
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
	test('assemble string', () => {


		let i = new AddiInstruction(Registers.get(1), Registers.get(2), new Immediate12(10));

		let instructions = `
		addi r1, r0, 0xffff
		add r2, r1, r1 # r2 = 0x1fffe
		addi r3, r0, 0xff # r3 is the address we will store the result r2
		sw r3, 0x0(r2)`

		Assembler.parse(instructions.split("\n"));

	});

	test('load in memory', () => {

	});
});