import { Assembler } from "../src/riscv/assembler"
import { Immediate20 } from "../src/riscv/immediate"

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

export function main() {

	// jal rs, 0
	// jalr rd, 0(rs)

	Pipeline.init();
	let source: string;

	source = `
addi a0, zero, 100
jalr ra, fun1(zero)
add t3, zero, a0
halt

fun1:
	addi sp, sp, -8
	sw ra, 4(sp)
	sw a0, 0(sp)

	addi a0, a0, 10
	# jalr ra, fun2(zero)
	sw t2, 0(a0)

	lw ra, 4(sp)
	lw a0, 0(sp)
	addi sp, sp, 8

	add a0, t2, zero
	jal ra, 0
	
# fun2:
# 	addi a0, a0, 1
# 	jal ra, 0
`

	Assembler.parse(source.split("\n"));

	Labels.show()

	Pipeline.run(1000);

	Memory.show()

	Registers.show();

}