import { bin } from "../../src/riscv/utils";
import { Instruction } from "../../src/riscv/instruction";
import { AddInstruction, SubInstruction, OrInstruction, XorInstruction, AndInstruction } from "../../src/riscv/instructions/rtype"
import { JalrInstruction, LwInstruction, AddiInstruction } from "../../src/riscv/instructions/itype"
import { SwInstruction } from "../../src/riscv/instructions/stype"
import { BeqInstruction } from "../../src/riscv/instructions/btype"
import { LuiInstruction } from "../../src/riscv/instructions/utype"
import { JalInstruction } from "../../src/riscv/instructions/jtype"

import { Registers } from "../../src/riscv/register";
import { InstructionRegistry } from "../../src/riscv/instructionRegistry";

describe('binary encoding and decoding', () => {
	describe('r type', () => {
		test('binary number', () => {
			expect(bin(0b101010) == "101010");
		});

		test('add', () => {
			let i = new AddInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});

		test('sub', () => {
			let i = new SubInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});

		test('or', () => {
			let i = new OrInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});

		test('xor', () => {
			let i = new XorInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});

		test('and', () => {
			let i = new AndInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});
	});

	describe('i type', () => {
		test('jalr', () => {
			let i = new JalrInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});

		test('lw', () => {
			let i = new LwInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});

		test('addi', () => {
			let i = new AddiInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});
	});

	describe('s type', () => {
		test('addi', () => {
			let i = new SwInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});
	});

	describe('b type', () => {
		test('beq', () => {
			let i = new BeqInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});
	});

	describe('u type', () => {
		test('beq', () => {
			let i = new LuiInstruction(Registers.get(1), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});
	});

	describe('j type', () => {
		test('jal', () => {
			let i = new JalInstruction(Registers.get(1), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(bin(encoded, 32)).toBe(bin(decoded.encode(), 32));
		});
	});
});

describe('plaintext asm encoding and decoding', () => {
	test('binary number', () => {
		expect(bin(0b101010) == "101010");
	});

	describe('r type', () => {
		test('add', () => {
			let i = new AddInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let disassembled = i.disassemble();
			let assembled = Instruction.assemble(disassembled);
			expect(disassembled == assembled.disassemble());
		});
	});

	describe('i type', () => {
		test('jalr', () => {
			let i = new JalrInstruction(Registers.get(1), Registers.get(2), 123)
			let disassembled = i.disassemble();
			let assembled = Instruction.assemble(disassembled);
			expect(disassembled == assembled.disassemble());
		});

		test('immediate', () => {
			let i1 = "jalr i1, 63(i2)"
			let i2 = "jalr i1, 0d63(i2)"
			let i3 = "jalr i1, 0b111111(i2)"
			let i4 = "jalr i1, 0x3f(i2)"
			let i5 = "jalr i1, 0o77(i2)"

			expect(Instruction.assemble(i1).disassemble() == Instruction.assemble(i2).disassemble());

			expect(Instruction.assemble(i1).disassemble() == Instruction.assemble(i3).disassemble());

			expect(Instruction.assemble(i1).disassemble() == Instruction.assemble(i4).disassemble());

			expect(Instruction.assemble(i1).disassemble() == Instruction.assemble(i5).disassemble());
		});
	});

	describe('s type', () => {
		test('addi', () => {
			let i = new SwInstruction(Registers.get(1), Registers.get(2), 123)
			let disassembled = i.disassemble();
			let assembled = Instruction.assemble(disassembled);
			expect(disassembled == assembled.disassemble());
		});
	});

	describe('b type', () => {
		test('add', () => {
			let i = new BeqInstruction(Registers.get(1), Registers.get(2), 123)
			let disassembled = i.disassemble();
			let assembled = Instruction.assemble(disassembled);
			expect(disassembled == assembled.disassemble());
		});
	});

	describe('i type', () => {
		test('jalr', () => {
			let i = new JalrInstruction(Registers.get(1), Registers.get(2), 123)
			let disassembled = i.disassemble();
			let assembled = Instruction.assemble(disassembled);
			expect(disassembled == assembled.disassemble());
		});

		test('lw', () => {
			let i = new LwInstruction(Registers.get(1), Registers.get(2), 123)
			let disassembled = i.disassemble();
			let assembled = Instruction.assemble(disassembled);
			expect(disassembled == assembled.disassemble());
		});

		test('addi', () => {
			let i = new AddiInstruction(Registers.get(1), Registers.get(2), 123)
			let disassembled = i.disassemble();
			let assembled = Instruction.assemble(disassembled);
			expect(disassembled == assembled.disassemble());
		});
	});

});