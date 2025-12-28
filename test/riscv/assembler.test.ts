import { Memory } from "../../src/riscv/memory";
import { Pipeline } from "../../src/riscv//pipeline";
import { Assembler } from "../../src/riscv/assembler"

// side effect imports
import "../../src/riscv/instructions/btype"
import "../../src/riscv/instructions/itype"
import "../../src/riscv/instructions/jtype"
import "../../src/riscv/instructions/rtype"
import "../../src/riscv/instructions/stype"
import "../../src/riscv/instructions/utype"
import { Registers } from "../../src/riscv/register";

describe('assembling', () => {
	test('assemble string and run', () => {

		Pipeline.init();

		let instructions = `
		addi i1, i0, 0xff
		add i2, i1, i1 # i2 = 0x1fe
		addi i3, i0, 0x100 # i3 is the address we will store the result i2
		sw i2, 0x0(i3)
		`

		let as = new Assembler(instructions.split("\n"));

		as.parse();

		Pipeline.run();

		expect(Memory.get(0x100)).toBe(0x1fe);
	});

	test('fibonacci', () => {

		Pipeline.init();

		let instructions = `
			addi i10, i0, 0
			addi i11, i0, 1
			addi i1, i0, 40 # i1 = 40
		loop:
			addi i1, i1, -4 # i -= 4
			add i12, i0, i11
			add i11, i11, i10
			add i10, i0, i12
			sw i10, 0x100(i1) # 0xff is the base address of the array, of size 4B and length 10
			bne i1, i0, loop # while i1 > 0
		`

		let as = new Assembler(instructions.split("\n"));

		as.parse();

		Memory.show()

		Pipeline.run();

		expect(Memory.get(0x100)).toBe(55);
	});

	test("function call and return", () => {

		Pipeline.init();

		let instructions = `
			addi i10, i0, 0x10
			jalr i3, fun(i0)
			addi i2, i0, 2
			halt
			addi i4, i0, 0x4
			fun:
			addi i1, i0, 0x1
			jal i3, 0
		`

		let as = new Assembler(instructions.split("\n"));

		as.parse();

		Pipeline.run(100);

		expect(Registers.parse("i1").value).toBe(1);
		expect(Registers.parse("i2").value).toBe(2);
		expect(Registers.parse("i4").value).toBe(0);

	});

	test("diff of sums", () => {

		Pipeline.init();

		let instructions = `
			main:
				addi a0, zero, 2 # argument 0 = 2
				addi a1, zero, 3 # argument 1 = 3
				addi a2, zero, 4 # argument 2 = 4
				addi a3, zero, 5 # argument 3 = 5
				jalr ra, diffofsums(zero) # call function

			add s7, a0, zero # y = returned value

			halt

			diffofsums:
				add t0, a0, a1 # t0 = f+g
				add t1, a2, a3 # t1 = h+i
				sub s3, t0, t1 # result = (f+g)−(h+i)
				add a0, s3, zero # put return value in a0
				jal ra, 0
		`

		let as = new Assembler(instructions.split("\n"));

		as.parse();

		Pipeline.run(100);

		expect(Registers.parse("s7").value).toBe(-4);

	});

	test("stack pointer", () => {

		Pipeline.init();

		let instructions = `
			addi i2, i0, 0x100     # sp = 256

			addi i2, i2, -4
			addi i1, i0, 11
			sw   i1, 0(i2)

			addi i2, i2, -4
			addi i1, i0, 22
			sw   i1, 0(i2)

			lw   i4, 0(i2)         # pop
			addi i2, i2, 4

			lw   i5, 0(i2)         # pop
			addi i2, i2, 4
		`

		let as = new Assembler(instructions.split("\n"));

		as.parse();

		Pipeline.run(100);

		expect(Registers.parse("i4").value).toBe(22)

		expect(Registers.parse("i5").value).toBe(11)
	});

	test("stack pointer wrapping", () => {

		Pipeline.init();

		let instructions = `
			addi ra, zero, 1000
			addi sp, sp, -4
			sw ra, 0(sp)
		`

		let as = new Assembler(instructions.split("\n"));

		as.parse();

		Pipeline.run(100);

		expect(Memory.get(0xffff_fffc)).toBe(1000);
	});

});
