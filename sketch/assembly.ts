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

export function main() {

	// jal rs, 0
	// jalr rd, 0(rs)

	// addi a0, zero, 100
	// jalr ra, fun1(zero)
	// add t3, zero, a0
	// halt
	// 
	// fun1:
	// 	addi sp, sp, -8 # make space
	// 	sw ra, 4(sp) # store return address
	// 	sw a0, 0(sp) # store first argument
	// 
	// 	addi a0, a0, 10 # body of the function
	// 
	// 	lw ra, 4(sp)
	// 
	// 	addi sp, sp, 8
	// 	jal ra, 0

	let source = `
(defun minus (args x y) (+ x (- y)))
(minus 1 2)
`.split("\n").filter(x => x.trim() != "");

	source.forEach(x => console.log(x));

	let c = new Compiler(source);
	let assembly = c.compile();

	assembly.forEach(line => console.log(line));

	Assembler.parse(assembly);

	Labels.show()

	Pipeline.run(1000);

	Memory.show()

	Registers.show();
}
