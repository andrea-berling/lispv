import { bin } from "../../src/riscv/utils";
import { Instruction } from "../../src/riscv/instruction";
import { AddInstruction, SubInstruction } from "../../src/riscv/instructions/rtype"
import { JalrInstruction, LwInstruction, AddiInstruction } from "../../src/riscv/instructions/itype"
import { Registers } from "../../src/riscv/register";
import { Memory } from "../../src/riscv/peripherals";
import { ProgramCounter } from "../../src/riscv/program_counter";
import { SwInstruction } from "../../src/riscv/instructions/stype";
import { Pipeline } from "../../src/riscv//pipeline";

describe('execution', () => {
	test('manual execution', () => {
		let addr = 0x0000_0000;
		let i: Instruction;

		Memory.clean();
		Registers.clean();

		// addi r1, r0, 0xffff
		// add r2, r1, r1 # r2 = 0x1fffe
		// addi r3, r0, 0xff # r3 is the address we will store the result r2
		// sw r3, 0x0(r2);
		// halt

		i = new AddiInstruction(Registers.get(1), Registers.get(0), 0xffff);
		Memory.set(addr, i.encode());
		i.execute()
		addr += 4;

		i = new AddInstruction(Registers.get(2), Registers.get(1), Registers.get(1));
		Memory.set(addr, i.encode());
		i.execute()
		addr += 4;

		i = new AddiInstruction(Registers.get(3), Registers.get(0), 0xff);
		Memory.set(addr, i.encode());
		i.execute()
		addr += 4;

		i = new SwInstruction(Registers.get(3), Registers.get(2), 0x0);
		Memory.set(addr, i.encode());
		i.execute()
		addr += 4;

		expect(Memory.get(0xff)).toBe(0x1fffe);
	});

	test('automatic execution', () => {
		let addr = 0x0000_0000;
		let i: Instruction;

		Pipeline.init()

		i = new AddiInstruction(Registers.get(1), Registers.get(0), 0x123);
		Memory.set(addr, i.encode());
		addr += 4;

		i = new AddInstruction(Registers.get(2), Registers.get(1), Registers.get(1));
		Memory.set(addr, i.encode());
		addr += 4;

		i = new AddiInstruction(Registers.get(3), Registers.get(0), 0xff);
		Memory.set(addr, i.encode());
		addr += 4;

		i = new SwInstruction(Registers.get(3), Registers.get(2), 0x0);
		Memory.set(addr, i.encode());
		addr += 4;

		Pipeline.run();

		expect(Memory.get(0xff)).toBe(0x246);
	});
});