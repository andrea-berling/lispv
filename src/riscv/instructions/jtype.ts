import { Instruction } from "../instruction"
import { Register, Registers } from "../register";
import { Memory } from "../peripherals";
import { parseImmediate } from "../utils";
import { InstructionRegistry } from "../instructionRegistry";

abstract class JTypeInstruction extends Instruction {
	destination: Register;
	immediate: number;

	constructor(destination: Register, immediate: number) {
		super();
		this.destination = destination;
		this.immediate = immediate;
	}

	encode(): number {
		let encoded = 0;
		let shift = 0;
		encoded += this.opcode;
		shift += 7;
		encoded += this.destination.index << shift;
		shift += 5;
		encoded += ((this.immediate >> 12) & 0b11111111) << shift;
		shift += 8;
		encoded += ((this.immediate >> 11) & 0b1) << shift;
		shift += 1;
		encoded += ((this.immediate >> 1) & 0b1111111111) << shift;
		shift += 10;
		encoded += ((this.immediate >> 20) & 0b1) << shift;
		return encoded;
	}

	static factoryFromBinary(encoded: number): Instruction {
		const rd = (encoded >> 7) & 0b11111;
		const imm = (encoded >> 12);

		return new (this as any)(
			Registers.get(rd),
			imm
		) as Instruction;
	}

	disassemble(): string {
		return `${this.tag} ${this.destination}, ${this.immediate}`
	}

	static factoryFromAssembly(parameters: string): Instruction {
		let p = parameters.split(",");
		const source1 = Registers.parse(p[0]);
		const source2 = Registers.parse(p[1]);
		const imm = parseImmediate(p[2]);

		return new (this as any)(
			source1,
			source2,
			imm
		) as Instruction
	}
}

export class JalInstruction extends JTypeInstruction {
	static tag = "lui";
	static opcode = 0b1101111;

	execute(): void {

	}

	static {
		InstructionRegistry.register(this);
	}
}
