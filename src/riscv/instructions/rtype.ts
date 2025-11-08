import { Instruction } from "../instruction"
import { Register, Registers } from "../register";

abstract class RTypeInstruction extends Instruction {
	destination: Register;
	source1: Register;
	source2: Register;
	static opcode = 0b0110011;
	static f3 = 0b000;
	static f7 = 0b0000000;

	constructor(destination: Register, source1: Register, source2: Register) {
		super();
		this.destination = destination;
		this.source1 = source1;
		this.source2 = source2;
	}

	toString(): string {
		return `${this.tag} ${this.destination.toString()}, ${this.source1.toString()}, ${this.source2.toString()}`;
	}

	encode(): number {
		let encoded = 0;
		let shift = 0;
		encoded += this.opcode;
		shift += 7;
		encoded += this.destination.index << shift;
		shift += 5;
		encoded += this.f3 << shift;
		shift += 3;
		encoded += this.source1.index << shift;
		shift += 5;
		encoded += this.source2.index << shift;
		shift += 5;
		encoded += this.f7 << shift;
		return encoded;
	}

	static factoryBinary(encoded: number): Instruction {
		const rd = (encoded >> 7) & 0b11111;
		const rs1 = (encoded >> 15) & 0b11111;
		const rs2 = (encoded >> 20) & 0b11111;

		return new (this as any)(
			Registers.get(rd),
			Registers.get(rs1),
			Registers.get(rs2)
		) as Instruction;
	}

	disassemble(): string {
		return `${this.tag} ${this.destination}, ${this.source1}, ${this.source2}`
	}

	static factoryTag(parameters: string): Instruction {
		let p = parameters.split(",");
		const rd = Number.parseInt(p[0].replace("i", "").trim())
		const rs1 = Number.parseInt(p[1].replace("i", "").trim())
		const rs2 = Number.parseInt(p[0].replace("i", "").trim())

		return new (this as any)(
			Registers.get(rd),
			Registers.get(rs1),
			Registers.get(rs2)
		) as Instruction;
	}
}

export class AddInstruction extends RTypeInstruction {
	static tag = "add";

	execute(): void {
		this.destination.value = this.source1.value + this.source2.value;
	}

	static {
		this.signal();
	}
}

export class SubInstruction extends RTypeInstruction {
	static tag = "sub";
	static f7 = 0b0100000;

	execute(): void {
		this.destination.value = this.source1.value - this.source2.value;
	}

	static {
		this.signal();
	}
}

export class XorInstruction extends RTypeInstruction {
	static tag = "xor";
	static f3 = 0b100;

	execute(): void {
		this.destination.value = this.source1.value ^ this.source2.value;
	}

	static {
		this.signal();
	}
}

export class OrInstruction extends RTypeInstruction {
	static tag = "or";
	static f3 = 0b110;

	execute(): void {
		this.destination.value = this.source1.value | this.source2.value;
	}

	static {
		this.signal();
	}
}

export class AndInstruction extends RTypeInstruction {
	static tag = "and";
	static f3 = 0b111;

	execute(): void {
		this.destination.value = this.source1.value & this.source2.value;
	}

	static {
		this.signal();
	}
}