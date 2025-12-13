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

	Pipeline.init();
	let source: string;

	source = `
# main
addi i2, i0, 0x200
addi i1, i0, 3        # n = 3
jal  i3, count
halt

count:
addi i2, i2, -8
sw   i3, 4(i2)
sw   i1, 0(i2)

beq  i1, i0, base

addi i1, i1, -1
jal  i3, count

base:
lw   i1, 0(i2)
lw   i3, 4(i2)
addi i2, i2, 8
jalr i3, 0(i0)
	`

	source = `
main:
addi a0, zero, 2 # argument 0 = 2
addi a1, zero, 3 # argument 1 = 3
addi a2, zero, 4 # argument 2 = 4
addi a3, zero, 5 # argument 3 = 5
jalr ra, diffofsums(zero) # call function

add s7, a0, zero # y = returned value

halt

diffofsums:
add t0, a0, a1 # t0 = f+g
add t1, a2, a3 # t1 = h+i
sub s3, t0, t1 # result = (f+g)−(h+i)
add a0, s3, zero # put return value in a0
jal ra, 0
`

	Assembler.parse(source.split("\n"));

	Labels.show()

	Pipeline.run(120);

	Memory.show()

	Registers.show();

}