import { Assembler } from "../src/riscv/assembler"

import "../src/riscv/instructions/btype"
import "../src/riscv/instructions/itype"
import "../src/riscv/instructions/jtype"
import "../src/riscv/instructions/rtype"
import "../src/riscv/instructions/stype"
import "../src/riscv/instructions/utype"
import { Memory } from "../src/riscv/memory"
import { Pipeline } from "../src/riscv/pipeline"
import { Registers } from "../src/riscv/register"

export function main() {


	let source = `
addi i1, i0, 100
	`

	Assembler.parse(source.split("\n"));

	Memory.show()

	Pipeline.run();

	Registers.show();

}