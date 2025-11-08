import { bin } from "../../src/riscv/utils";
import { Instruction } from "../../src/riscv/instruction";
import { AddInstruction, SubInstruction } from "../../src/riscv/instructions/rtype"
import { JalrInstruction, LwInstruction } from "../../src/riscv/instructions/itype"
import { SwInstruction } from "../../src/riscv/instructions/stype"
import { BeqInstruction } from "../../src/riscv/instructions/btype"
import { Registers } from "../../src/riscv/register";

describe('binary encoding and decoding', () => {
	describe('r type', () => {
		test('binary number', () => {
			expect(bin(0b101010) == "101010");
		});

		test('add', () => {
			let i = new AddInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(encoded == decoded.encode());
		});

		test('sub', () => {
			let i = new SubInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(encoded == decoded.encode());
		});
	});

	describe('i type', () => {
		test('jalr', () => {
			let i = new JalrInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(encoded == decoded.encode());
		});

		test('lw', () => {
			let i = new LwInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(encoded == decoded.encode());
		});

		test('addi', () => {
			let i = new LwInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(encoded == decoded.encode());
		});
	});

	describe('s type', () => {
		test('addi', () => {
			let i = new SwInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(encoded == decoded.encode());
		});
	});

	describe('b type', () => {
		test('beq', () => {
			let i = new BeqInstruction(Registers.get(1), Registers.get(2), 123)
			let encoded = i.encode();
			let decoded = Instruction.decode(encoded);
			expect(encoded == decoded.encode());
			console.log(bin(encoded, 32));
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
});