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

function isCompilerIdempotentToInterpreter(i: Interpreter) {
	return Registers.parse("a0").value == i.run();
}

describe("compiled", () => {
	test("defun", () => {
		let source = `
		(defun plus (args x y z) (+ x y z))
		(plus 1 2 3)
		`.split("\n").map(x => x.trim()).filter(x => x != "");
		console.log(source);

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(isCompilerIdempotentToInterpreter(i)).toBe(true);
	})

	test("primitives", () => {
		let source = `
		(+ 1 2)
		`.split("\n").map(x => x.trim()).filter(x => x != "");
		console.log(source);

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(isCompilerIdempotentToInterpreter(i)).toBe(true);
	})
});