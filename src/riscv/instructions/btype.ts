import { Instruction } from "../instruction"
import { Register, Registers } from "../register";
import { Memory } from "../peripherals";
import { parseImmediate } from "../utils";
import { InstructionRegistry } from "../instructionRegistry";

abstract class BTypeInstruction extends Instruction {
	source1: Register;
	source2: Register;
	immediate: number;
	static opcode = 0b1100011;

	constructor(source1: Register, source2: Register, immediate: number) {
		super();
		this.source1 = source1;
		this.source2 = source2;
		this.immediate = immediate; // the branch is always at a multiple of 2, so we discard the 0th bit
	}

	encode(): number {
		let encoded = 0;
		let shift = 0;
		encoded += this.opcode;
		shift += 7;
		encoded += ((this.immediate >> 11) & 0b1) << shift;
		shift += 1;
		encoded += ((this.immediate >> 1) & 0b1111) << shift;
		shift += 4;
		encoded += (this.f3 || 0) << shift;
		shift += 3;
		encoded += this.source1.index << shift;
		shift += 5;
		encoded += this.source2.index << shift;
		shift += 5;
		encoded += ((this.immediate >> 5) & 0b111111) << shift;
		shift += 6;
		encoded += ((this.immediate >> 12) & 0b1) << shift;
		return encoded;
	}

	static factoryFromBinary(encoded: number): Instruction {
		const rs1 = (encoded >> 15) & 0b11111;
		const rs2 = (encoded >> 20) & 0b11111;
		let imm = 0;
		let shift = 0;
		imm += (encoded >> 8 & 0b11111)
		shift += 5;
		imm += ((encoded >> 25 & 0b111111) << shift);
		shift += 6;
		imm += ((encoded >> 7 & 0b1) << shift);
		shift += 1;
		imm += ((encoded >> 31 & 0b1) << shift);

		return new (this as any)(
			Registers.get(rs1),
			Registers.get(rs2),
			imm
		) as Instruction;
	}

	disassemble(): string {
		return `${this.tag} ${this.source2}, ${this.immediate}(${this.source1})`
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

export class BeqInstruction extends BTypeInstruction {
	name = "beq";

	execute(): void {
	}

	static {
		InstructionRegistry.register(this);
	}
}