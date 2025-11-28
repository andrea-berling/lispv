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

Pipeline.init();

let instructions = `
		addi i10, i0, 0
		addi i11, i0, 1
		addi i1, i0, 10 # i1 = 10
		loop:
		addi i1, i1, -1
		add i12, i0, i10
		add i10, i10, i11
		add i11, i12, i11
		bne i1, i0, loop # while i1 > 0
		`

Assembler.parse(instructions.split("\n"));

Memory.show()

Pipeline.run();

Registers.show();