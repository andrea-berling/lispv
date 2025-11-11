import { Register, Registers } from "./register";


function SignalInstruction(constructor: Function) {
	let i = (constructor as any) as (typeof Instruction);
	console.log(i.tag)
	console.log(i.opcode)
	console.log(i.f3)
	console.log(i.f7)
}

abstract class Instruction {
	static opcode: number = 0b0000000;
	static f3: number | null = null;
	static f7: number | null = null;
	static tag: string = "";
}

abstract class RTypeInstruction extends Instruction {
	destination: Register;
	source1: Register;
	source2: Register;
	static opcode = 0b0110011;

	constructor(destination: Register, source1: Register, source2: Register) {
		super();
		this.destination = destination;
		this.source1 = source1;
		this.source2 = source2;
	}
}

@SignalInstruction
class AddInstruction extends RTypeInstruction {
	static tag = "add";
	static f3 = 0b000;
}

@SignalInstruction
class SubInstruction extends RTypeInstruction {
	static tag = "sub";
	static f3 = 0b000;
	static f7 = 0b0100000;
}

let add = new AddInstruction(Registers.get(1), Registers.get(2), Registers.get(3));
let sub = new SubInstruction(Registers.get(1), Registers.get(2), Registers.get(3));