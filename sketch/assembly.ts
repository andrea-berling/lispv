import { EApplication } from "../src/lang/expressions/application"
import { EExpression } from "../src/lang/expressions/expression"
import { ENumber } from "../src/lang/expressions/number"
import { EArgs } from "../src/lang/expressions/operations/args"
import { EDefun } from "../src/lang/expressions/operations/defun"
import { EFunction } from "../src/lang/expressions/operations/function"
import { EPlus } from "../src/lang/expressions/operations/plus"
import { EVariable } from "../src/lang/expressions/variable"
import { Traversal } from "../src/lang/traversal"

import "../src/riscv/instructions/utype"
import "../src/riscv/instructions/jtype"
import "../src/riscv/instructions/btype"
import "../src/riscv/instructions/itype"
import "../src/riscv/instructions/stype"
import "../src/riscv/instructions/rtype"

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

	let source = `
		(if (1) (1) (0))
	`

	let c = new Compiler(source);

	let assembly = c.compile();

	let as = new Assembler(assembly);

	as.log();

	console.log(source);

	as.parse();

	Pipeline.run(10000);

	Registers.show();

	let i = new Interpreter(source);

	console.log(i.run());

	console.log(Registers.parse("a0").value == i.run());

}
