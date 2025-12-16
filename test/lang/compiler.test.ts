import { Compiler } from "../../src/lang/compiler"
import { Assembler } from "../../src/riscv/assembler";
import { Labels } from "../../src/riscv/label";
import { Pipeline } from "../../src/riscv/pipeline";
import { Registers } from "../../src/riscv/register";

import "../../src/riscv/instructions/btype"
import "../../src/riscv/instructions/itype"
import "../../src/riscv/instructions/jtype"
import "../../src/riscv/instructions/rtype"
import "../../src/riscv/instructions/stype"
import "../../src/riscv/instructions/utype"

describe("interpreter", () => {
	test("defun", () => {
		let source = `
(defun plus (args x y z) (+ x y z))
(plus 1 2 3)
`
		let c = new Compiler(source.split("\n"));

		let assembly = c.compile();

		Assembler.parse(assembly);

		Pipeline.run();

		expect(Registers.parse("a0").value).toBe(6);
	})
});