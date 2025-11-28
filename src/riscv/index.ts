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
	addi i10, i0, 0
	addi i11, i0, 1
	addi i1, i0, 40 # i1 = 40
loop:
	addi i1, i1, -4 # i -= 4
	add i12, i0, i11
	add i11, i11, i10
	add i10, i0, i12
	sw i10, 0xff(i1) # 0xff is the base address of the array, of size 4B and length 10
	bne i1, i0, loop # while i1 > 0
`

Assembler.parse(instructions.split("\n"));

Memory.show();

Labels.show();

Pipeline.run();

Memory.show();

Registers.show();