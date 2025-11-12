// import instructions concrete classes first
import { AddInstruction, SubInstruction } from "./rtype";
import { Instruction } from "../instruction";
import { Registers } from "../register";
import { InstructionRegistry } from "./instructionRegistry";

let add = new AddInstruction(Registers.get(1), Registers.get(2), Registers.get(3));
let sub = new SubInstruction(Registers.get(1), Registers.get(2), Registers.get(3));

console.log(InstructionRegistry.getInstance().getBinaryRegistry());