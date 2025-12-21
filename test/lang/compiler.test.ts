import { Compiler } from "../../src/lang/compiler"
import { Assembler } from "../../src/riscv/assembler";
import { Pipeline } from "../../src/riscv/pipeline";
import { Registers } from "../../src/riscv/register";
import { Interpreter } from "../../src/lang/interpreter";

import "../../src/riscv/instructions/btype"
import "../../src/riscv/instructions/itype"
import "../../src/riscv/instructions/jtype"
import "../../src/riscv/instructions/rtype"
import "../../src/riscv/instructions/stype"
import "../../src/riscv/instructions/utype"

describe("compiled", () => {
	test("primitives", () => {
		Pipeline.init();

		let source = `
		(+ 1 2)
		`.split("\n").map(x => x.trim()).filter(x => x != "");

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());
	})


	test("defun", () => {
		Pipeline.init();

		let source = `
		(defun plus (args x y z) (+ x y z))
		(plus 1 2 3)
		`.split("\n").map(x => x.trim()).filter(x => x != "");

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());
	})

	test("nested operations", () => {
		Pipeline.init();

		let source = `
		(+ 2 (- 4 5 6) (+ 3 4 (- 1 2 3) 6))
		`

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());
	})

});
