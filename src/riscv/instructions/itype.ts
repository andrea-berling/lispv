import { bin } from "../utils";
import { Instruction } from "../instruction"
import { Register, Registers } from "../register";
import { Memory } from "../memory";
import { ProgramCounter } from "../program_counter";
import { InstructionRegistry } from "../instructionRegistry";
import { Immediate12 } from "../immediate";

abstract class ITypeInstruction extends Instruction {
	destination: Register;
	source: Register;
	immediate: Immediate12;

	constructor(destination: Register, source: Register, immediate: Immediate12) {
		super();
		this.destination = destination;
		this.source = source;
		this.immediate = immediate;
	}

	encode(): number {
		let encoded = 0;
		let shift = 0;
		encoded += this.opcode;
		shift += 7;
		encoded += this.destination.index << shift;
		shift += 5;
		encoded += (this.f3 || 0) << shift;
		shift += 3;
		encoded += this.source.index << shift;
		shift += 5;
		encoded += this.immediate.value << shift;
		return encoded;
	}


	static factoryFromBinary(encoded: number): Instruction {
		const rd = (encoded >> 7) & 0b11111;
		const rs = (encoded >> 15) & 0b11111;
		const imm = (encoded >> 20) & ((1 << 12) - 1);

		return new (this as any)(
			Registers.get(rd),
			Registers.get(rs),
			new Immediate12(imm)
		) as Instruction;
	}

	disassemble(): string {
		return `${this.tag} ${this.destination}, ${this.immediate.value}(${this.source})`
	}

	static factoryFromAssembly(parameters: string): Instruction {
		let p = parameters.split(",");
		const destination = Registers.parse(p[0]);

		const others = p[1].split("(");
		const immediate = Immediate12.parse(others[0]);
		const source = Registers.parse(others[1].replace(")", ""));

		return new (this as any)(
			destination,
			source,
			immediate
		) as Instruction
	}
}

export class JalrInstruction extends ITypeInstruction {
	static tag = "jalr";
	static opcode = 0b1100111;

	execute(): void {
		this.destination.value = ProgramCounter.address;
		ProgramCounter.address = this.source.value + this.immediate.value;
	}

	static {
		InstructionRegistry.register(this);
	}
}

abstract class MemoryLoadInstruction extends ITypeInstruction {
	static opcode = 0b0000011;
}

export class LwInstruction extends MemoryLoadInstruction {
	static tag = "lw";
	static f3 = 0b010;

	execute(): void {
		this.destination.value = Memory.get(this.source.value + this.immediate.value);
	}

	static {
		InstructionRegistry.register(this);
	}
}

abstract class IntegerRegisterImmediateInstruction extends ITypeInstruction {
	static opcode = 0b0010011;

	static factoryFromAssembly(parameters: string): Instruction {
		let p = parameters.split(",");
		const destination = Registers.parse(p[0])
		const source1 = Registers.parse(p[1]);
		const immediate = Immediate12.parse(p[2]);

		return new (this as any)(
			destination,
			source1,
			immediate
		) as Instruction;
	}

	disassemble(): string {
		return `${this.tag} ${this.destination}, ${this.source}, ${this.immediate.value}`
	}
}

export class AddiInstruction extends IntegerRegisterImmediateInstruction {
	static tag = "addi";

	execute(): void {
		this.destination.value = this.source.value + this.immediate.value;
	}

	static {
		InstructionRegistry.register(this);
	}
}