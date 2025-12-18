import { EApplication } from "../src/lang/expressions/application"
import { EExpression } from "../src/lang/expressions/expression"
import { ENumber } from "../src/lang/expressions/number"
import { EArgs } from "../src/lang/expressions/operations/args"
import { EDefun } from "../src/lang/expressions/operations/defun"
import { EFunction } from "../src/lang/expressions/operations/function"
import { EPlus } from "../src/lang/expressions/operations/plus"
import { EVariable } from "../src/lang/expressions/variable"
import { Traversal } from "../src/lang/traversal"

import "../src/riscv/instructions/btype"
import "../src/riscv/instructions/itype"
import "../src/riscv/instructions/jtype"
import "../src/riscv/instructions/rtype"
import "../src/riscv/instructions/stype"
import "../src/riscv/instructions/utype"

import { Labels } from "../src/riscv/label"
import { Memory } from "../src/riscv/memory"
import { Pipeline } from "../src/riscv/pipeline"
import { Registers } from "../src/riscv/register"
import { Assembler } from "../src/riscv/assembler"
import { Interpreter } from "../src/lang/interpreter"
import { Compiler } from "../src/lang/compiler"
import { Primitives } from "../src/lang/lib/primitives"
import { COMPILER_ENV } from "../src/lang/environment"
import { InstructionRegistry } from "../src/riscv/instructionRegistry"
import { bin, signExtend } from "../src/riscv/utils"

export function main() {

	// jal rs, 0
	// jalr rd, 0(zero)

	let source = `
		(defun plus (args x y) (+ x y))
		(plus 3 4)
	`

	let c = new Compiler(source);

	let assembly = c.compile();

	let as = new Assembler(assembly);

	as.log();

	as.parse();

	// Labels.show()

	Pipeline.run(1000);

	// Memory.show()

	Registers.show();

	let i = new Interpreter(source);

	console.log(Registers.parse("a0").value == i.run());

	// Array.from(InstructionRegistry.tagRegistry.entries()).forEach(x => console.log(x));
	//
	// console.log(Array.from(InstructionRegistry.tagRegistry.entries()).length);


}
