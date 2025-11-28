import { bin } from "./utils";
import { Register, Registers } from "./register";
import { InstructionRegistry } from "./instructionRegistry";
import { AddInstruction, SubInstruction } from "./instructions/rtype";
import { Instruction } from "./instruction";
import { Memory } from "./memory";
import { AddiInstruction } from "./instructions/itype";
import { SwInstruction } from "./instructions/stype";
import { Pipeline } from "./pipeline";
import { JalInstruction } from "./instructions/jtype";
import { Immediate12, Immediate20 } from "./immediate";
import { Assembler } from "./assembler";

import "./instructions/btype"
import "./instructions/itype"
import "./instructions/jtype"
import "./instructions/rtype"
import "./instructions/stype"
import "./instructions/utype"
import { Labels } from "./label";

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