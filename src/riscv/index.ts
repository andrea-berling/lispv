import { bin } from "./utils";
import { Register, Registers } from "./register";
import { InstructionRegistry } from "./instructionRegistry";
import { AddInstruction, SubInstruction } from "./instructions/rtype";
import { Instruction } from "./instruction";
import { Memory } from "./peripherals";
import { AddiInstruction } from "./instructions/itype";
import { SwInstruction } from "./instructions/stype";
import { Pipeline } from "./pipeline";

let addr = 0x0000_0000;
let i: Instruction;

Pipeline.init();

i = new AddiInstruction(Registers.get(1), Registers.get(0), 0x123);
Memory.set(addr, i.encode());
addr += 4;

i = new AddInstruction(Registers.get(2), Registers.get(1), Registers.get(1));
Memory.set(addr, i.encode());
addr += 4;

i = new AddiInstruction(Registers.get(3), Registers.get(0), 0xff);
Memory.set(addr, i.encode());
addr += 4;

i = new SwInstruction(Registers.get(3), Registers.get(2), 0x0);
Memory.set(addr, i.encode());
addr += 4;

Pipeline.run();

Memory.show();
