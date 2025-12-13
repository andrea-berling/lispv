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

	let source = `
addi i10, i0, 0x10
jalr i3, fun(i0)
addi i2, i0, 2
halt
addi i4, i0, 0x4
fun:
addi i1, i0, 0x1
jal i3, 0
	`

	source = `
# main
addi i2, i0, 0x100    # sp = 0x100
jal i3, local
halt

local:
addi i2, i2, -4       # alloca 1 word
addi i1, i0, 42
sw i1, 0(i2)        # local = 42

lw i1, 0(i2)
addi i1, i1, 1        # local++

addi i2, i2, 4        # dealloca
jalr i3, 0(i0)
	`

	source = `
addi i2, i0, 0x100     # sp = 256

addi i2, i2, -4
addi i1, i0, 11
sw   i1, 0(i2)

addi i2, i2, -4
addi i1, i0, 22
sw   i1, 0(i2)

lw   i4, 0(i2)         # pop
addi i2, i2, 4

lw   i5, 0(i2)         # pop
addi i2, i2, 4

halt
	`

	source = `
addi i2, i0, 0x100

addi i2, i2, -8        # alloca 2 word

addi i1, i0, 10
sw   i1, 0(i2)         # local_a

addi i1, i0, 20
sw   i1, 4(i2)         # local_b

lw   i4, 0(i2)
lw   i5, 4(i2)

addi i2, i2, 8
halt
	`

	source = `
addi i2, i0, 0x100
jal  i3, f
halt

f:
addi i2, i2, -4
sw   i3, 0(i2)

jal  i3, g

lw   i3, 0(i2)
addi i2, i2, 4
jalr i3, 0(i0)

g:
addi i4, i0, 99
jalr i3, 0(i0)
	`

	Assembler.parse(source.split("\n"));

	Labels.show()

	Pipeline.run(100);

	Memory.show()

	Registers.show();

}