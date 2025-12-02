import { Register, Registers } from "../src/riscv/register";
import { Memory } from "../src/riscv/memory";
import { Pipeline } from "../src/riscv/pipeline";
import { Assembler } from "../src/riscv/assembler";

import "../src/riscv/instructions/btype"
import "../src/riscv/instructions/itype"
import "../src/riscv/instructions/jtype"
import "../src/riscv/instructions/rtype"
import "../src/riscv/instructions/stype"
import "../src/riscv/instructions/utype"
import { Labels } from "../src/riscv/label";

Pipeline.init();

let instructions = `
addi i10, i0, 1
addi i11, i0, 1
addi i1, i0, 40

loop:
    addi i1, i1, -4
    add i13, i0, i0
    add i14, i0, i11
    
mult_loop:
    add i13, i13, i10
    addi i14, i14, -1
    bne i14, i0, mult_loop
    add i10, i0, i13
    sw i10, 0xff(i1)
    addi i11, i11, 1
    bne i1, i0, loop
`

Assembler.parse(instructions.split("\n"));

Memory.show();

Labels.show();

Pipeline.run();
Memory.show();

Registers.show();