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
		addi i1, i0, 0xff
		add i2, i1, i1 # i2 = 0x1fe
		addi i3, i0, 0xff # i3 is the address we will store the result i2
		sw i3, 0x0(i2)`

Assembler.parse(instructions.split("\n"));

let i = new AddInstruction(Registers.get(1), Registers.get(2), Registers.get(3))
console.log(i);
let disassembled = i.disassemble();
console.log(disassembled);
let assembled = Instruction.assemble(disassembled);
console.log(assembled.disassemble());

// Memory.show()
