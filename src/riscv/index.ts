import { bin } from "./utils";
import { Register, Registers } from "./register";
import { InstructionRegistry } from "./instructionRegistry";
import { SubInstruction } from "./instructions/rtype";

let a = new SubInstruction(Registers.get(1), Registers.get(2), Registers.get(3))

for (let el of InstructionRegistry.getInstance().getBinaryRegistry().keys()) {
	let i = InstructionRegistry.getInstance().getBinaryRegistry().get(el) as any;
	if (i) {
		let b = bin(el, 32);
		console.log(b, i.tag, i.opcode, i.f3, i.f7);
	}
}