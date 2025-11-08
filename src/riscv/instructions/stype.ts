import { Instruction } from "../instruction"
import { Register, Registers } from "../register";
import { Memory } from "../peripherals";
import { parseImmediate } from "../utils";

abstract class STypeInstruction extends Instruction {
	source1: Register; // add to this the immediate, that's the address to store in memory
	source2: Register; // the value to store in memory
	immediate: number;
	static opcode = 0b0100011;

	constructor(source2: Register, source1: Register, immediate: number) {
		super();
		this.source1 = source1;
		this.source2 = source2;
		this.immediate = immediate;
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

	static factoryFromBinary(encoded: number): Instruction {
		const rd = (encoded >> 7) & 0b11111;
		const rs = (encoded >> 15) & 0b11111;
		const imm = (encoded >> 7) & 0b11111 + (((encoded >> 25) & 0b111111) >> 4);

		return new (this as any)(
			Registers.get(rd),
			Registers.get(rs),
			imm
		) as Instruction;
	}

	disassemble(): string {
		return `${this.tag} ${this.source2}, ${this.immediate}(${this.source1})`
	}

	static factoryFromAssembly(parameters: string): Instruction {
		let p = parameters.split(",");
		const source2 = Registers.parse(p[0]);

		const others = p[1].split("(");
		const imm = parseImmediate(others[0]);
		const source1 = Registers.parse(others[1].replace(")", ""));

		return new (this as any)(
			source2,
			source1,
			imm
		) as Instruction
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