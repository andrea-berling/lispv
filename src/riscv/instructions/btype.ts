import { Instruction } from "../instruction"
import { Register, Registers } from "../register";
import { Memory } from "../memory";
import { InstructionRegistry } from "../instructionRegistry";
import { Immediate12 } from "../immediate";

abstract class BTypeInstruction extends Instruction {
	source1: Register;
	source2: Register;
	immediate: Immediate12;
	static opcode = 0b1100011;

	constructor(source1: Register, source2: Register, immediate: Immediate12) {
		super();
		this.source1 = source1;
		this.source2 = source2;
		this.immediate = immediate;
	}

	encode(): number {
		let encoded = 0;
		let shift = 0;

		// opcode [6:0]
		encoded += this.opcode;
		shift += 7;

		// imm[11] [7]
		encoded += ((this.immediate.value >> 11) & 0b1) << shift;
		shift += 1;

		// imm[4:1] [11:8]
		encoded += ((this.immediate.value >> 1) & 0b1111) << shift;
		shift += 4;

		// f3 [14:12]
		encoded += (this.f3 || 0) << shift;
		shift += 3;

		// rs1 [19:15]
		encoded += this.source1.index << shift;
		shift += 5;

		// rs2 [24:20]
		encoded += this.source2.index << shift;
		shift += 5;

		// imm[10:5] [30:25]
		encoded += ((this.immediate.value >> 5) & 0b111111) << shift;
		shift += 6;

		// imm[12] [31]
		encoded += ((this.immediate.value >> 12) & 0b1) << shift;

		return encoded;
	}

	static factoryFromBinary(encoded: number): Instruction {
		const rs1 = (encoded >> 15) & 0b11111;
		const rs2 = (encoded >> 20) & 0b11111;

		// Reconstruct immediate from B-type format:
		// imm[12|10:5|4:1|11] stored as [31|30:25|11:8|7]
		let imm = 0;

		// imm[11] from bit [7]
		imm |= ((encoded >> 7) & 0b1) << 11;

		// imm[4:1] from bits [11:8]
		imm |= ((encoded >> 8) & 0b1111) << 1;

		// imm[10:5] from bits [30:25]
		imm |= ((encoded >> 25) & 0b111111) << 5;

		// imm[12] from bit [31]
		imm |= ((encoded >> 31) & 0b1) << 12;

		return new (this as any)(
			Registers.get(rs1),
			Registers.get(rs2),
			new Immediate12(imm)
		) as Instruction;
	}

	disassemble(): string {
		return `${this.tag} ${this.source2}, ${this.immediate.value}(${this.source1})`
	}

	static factoryFromAssembly(parameters: string): Instruction {
		let p = parameters.split(",");
		const source1 = Registers.parse(p[0]);
		const source2 = Registers.parse(p[1]);
		const immediate = Immediate12.parse(p[2]);

		return new (this as any)(
			source1,
			source2,
			immediate
		) as Instruction
	}
}

export class BeqInstruction extends BTypeInstruction {
	static tag = "beq";

	execute(): void {
	}

	static {
		InstructionRegistry.register(this);
	}
}