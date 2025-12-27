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
import { Memory, MemoryMode } from "../src/riscv/memory"
import { Pipeline } from "../src/riscv/pipeline"
import { Registers } from "../src/riscv/register"
import { Assembler } from "../src/riscv/assembler"
import { Interpreter } from "../src/lang/interpreter"
import { Compiler } from "../src/lang/compiler"
import { Primitives } from "../src/lang/lib/primitives"
import { COMPILER_ENV } from "../src/lang/environment"
import { InstructionRegistry } from "../src/riscv/instructionRegistry"
import { bin, signExtend } from "../src/riscv/utils"
import { Instruction } from "../src/riscv/instruction"
import { JalInstruction } from "../src/riscv/instructions/jtype"
import { Immediate12, Immediate20 } from "../src/riscv/immediate"

export function main() {
	let source = `
		(defun times (args a b) (if (b) (+ (times a (+ b (- 1))) a ) (0) ))
		(defun fact (args a) (if (a) (times a (fact (+ a (- 1))) ) (1) ))
		(fact 8)
	`

	Compiler.toggleIndentation();
	let c = new Compiler(source);

	let assembly = c.compile();

	let as = new Assembler(assembly);

	console.log(source);

	as.parse();

	as.log({hidePrologue: true, lineAddress: true});

	Pipeline.run();

	// Memory.show();

	Registers.show();

	// let i = new Interpreter(source);
	//
	// console.log(i.run());
	//
	// console.log(Registers.parse("a0").value == i.run());
	
}
