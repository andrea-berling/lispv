import "../src/riscv/instructions/utype"
import "../src/riscv/instructions/jtype"
import "../src/riscv/instructions/btype"
import "../src/riscv/instructions/itype"
import "../src/riscv/instructions/stype"
import "../src/riscv/instructions/rtype"

import { Pipeline } from "../src/riscv/pipeline"
import { Registers } from "../src/riscv/register"
import { Assembler } from "../src/riscv/assembler"

import { Compiler } from "../src/lang/compiler"
import { Interpreter } from "../src/lang/interpreter"

export function main() {
	let source = `
		(defun times (args a b) (if (b) (+ (times a (+ b (- 1))) a ) (0) ))
		(defun fact (args a) (if (a) (times a (fact (+ a (- 1))) ) (1) ))
		(fact 5)
	`

	Compiler.toggleIndentation();
	let c = new Compiler(source);

	let assembly = c.compile();

	let as = new Assembler(assembly);

	console.log(source);

	as.parse();

	as.log({hidePrologue: true, lineAddress: true});

	Pipeline.run();

	Registers.show();

	let i = new Interpreter(source);

	console.log(i.run());

	console.log(Registers.parse("a0").value == i.run());
	
}
