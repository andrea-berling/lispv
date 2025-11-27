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

let instructions = `
		addi r1, r0, 0xffff
		add r2, r1, r1 # r2 = 0x1fffe
		addi r3, r0, 0xff # r3 is the address we will store the result r2
		sw r3, 0x0(r2)`

Assembler.parse(instructions.split("\n"));

Memory.show()