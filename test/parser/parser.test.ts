import { Rule } from "../../src/parser/rule"
import { range } from "../../src/parser/utils"
import { Parser } from "../../src/parser/parser";


import "../../src/riscv/instructions/btype"
import "../../src/riscv/instructions/itype"
import "../../src/riscv/instructions/jtype"
import "../../src/riscv/instructions/rtype"
import "../../src/riscv/instructions/stype"
import "../../src/riscv/instructions/utype"
import { InstructionRegistry } from "../../src/riscv/instructionRegistry";

describe("parser", () => {

	const digit = Rule.or("digit", ..."1234567890".split("").map(x => Rule.literal(x)));
	const number = Rule.oneOrMore("number", digit)

	test("digit", () => {
		const p = new Parser(digit);

		expect(p.parse("1").matched).toBe(true)
		expect(p.parse("a").matched).toBe(false)
		expect(p.parse("12").matched).toBe(false)

	});

	test("integer number", () => {
		const p = new Parser(number);

		expect(p.parse("1").matched).toBe(true)
		expect(p.parse("a").matched).toBe(false)
		expect(p.parse("12").matched).toBe(true)
	});

	test("error position", () => {
		const p = new Parser(number);

		expect(p.parse("12345x").error?.position).toBe(5)
	});

	test("some simple assembly", () => {
		let ins = Array.from(InstructionRegistry.tagRegistry.keys());

		// assuming every instruction is of type R, so it is of the form
		// instr i<x>, i<y>, i<z>
		// where x, y, z are integers from 0 to 31

		const instruction = Rule.or("instruction", ...ins.map(x => Rule.literal(x)));
		const spaces = Rule.zeroOrMore("spaces", Rule.literal(" "));
		const comma = Rule.literal(",");
		const index = Rule.or("index", ...range(0, 31).map(x => Rule.literal("" + x)));

		const register = Rule.and("register", Rule.literal("i"), index);

		const line = Rule.and("line", instruction, spaces, register, comma, spaces, register, comma, spaces, register);

		const p = new Parser(line);

		expect(p.parse("add i1, i2, i3").matched).toBe(true);
		expect(p.parse("sub i1, i2, i3").matched).toBe(true);
		expect(p.parse("add i10, i10, i10").matched).toBe(true);
		expect(p.parse("add i100, i2, i3").matched).toBe(false);

	})

});
