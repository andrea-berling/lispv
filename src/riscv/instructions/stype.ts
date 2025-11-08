import { Instruction } from "../instruction"
import { Register, Registers } from "../register";
import { Memory } from "../peripherals";

abstract class STypeInstruction extends Instruction {
	source1: Register; // the value to store in memory
	source2: Register; // add to this the immediate, that's the address to store in memory
	immediate: number;
	static opcode = 0b0100011;

	constructor(destination: Register, source: Register, immediate: number) {
		super();
		this.source1 = destination;
		this.source2 = source;
		this.immediate = immediate;
	}

	toString(): string {
		return `${this.tag} ${this.source1.toString()}, ${this.immediate}(${this.source2.toString()})`
	}

	encode(): number {
		let encoded = 0;
		let shift = 0;
		encoded += this.opcode;
		shift += 7;
		encoded += (this.immediate & (0b11111)) << shift; // imm[4:0]
		shift += 5;
		encoded += this.f3 << shift;
		shift += 3;
		encoded += this.source1.index << shift;
		shift += 5;
		encoded += this.source2.index << shift;
		shift += 5;
		encoded += (this.immediate & (0b111111100000)) << shift; // imm[11:5]
		return encoded;
	}

	disassemble(): string {
		return "TODO";
	}
}

export class SwInstruction extends STypeInstruction {
	name = "lw";
	static f3 = 0b010;

	execute(): void {
		Memory.set(this.source2.value + this.immediate, this.source1.value);
	}

	static {
		this.signal();
	}
}