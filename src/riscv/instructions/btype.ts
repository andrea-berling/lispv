import { Instruction } from "../instruction"
import { Register, Registers } from "../register";
import { Memory } from "../peripherals";

abstract class BTypeInstruction extends Instruction {
	source1: Register;
	source2: Register;
	immediate: number;
	static opcode = 0b1100011;

	constructor(destination: Register, source: Register, immediate: number) {
		super();
		this.source1 = destination;
		this.source2 = source;
		this.immediate = immediate; // the branch is always at a multiple of 2
	}

	toString(): string {
		return `${this.tag} ${this.source1.toString()}, ${this.source2.toString()}, ${this.toString()}`
	}

	disassemble(): string {
		return "TODO";
	}
}