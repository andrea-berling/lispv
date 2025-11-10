import { AddInstruction, SubInstruction } from "./instructions/rtype";
import { Instruction } from "./instruction";
import { bin } from "./utils";
import { Register, Registers } from "./register";

let a = new SubInstruction(Registers.get(1),Registers.get(2),Registers.get(3))

for (let el of Instruction.binaryRegistry.keys()) {
	let i = Instruction.binaryRegistry.get(el) as any;
	if (i) {
		let b = bin(el, 32);
		console.log(b, i.tag, i.opcode, i.f3, i.f7);
	}
}