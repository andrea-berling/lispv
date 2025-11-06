export function bin(num: number) {
	return (num >>> 0).toString(2);
}

export class Register {
	name: string;
	value: number;
	constructor(name: string, value: number) {
		this.name = name;
		this.value = value;
	}
}

// data memory and instruction memory are unified (Von Neumann architecture).
export abstract class Memory {
	private static cells: Map<number, number>

	static {
		Memory.cells = new Map<number, number>();
	}

	public static set(address: number, word: number): void {
		address = address | 0;
		word = word | 0;
		Memory.cells.set(address, word);
	}

	public static get(address: number): number {
		let word = Memory.cells.get(address);
		if (!word) {
			return 0; // memory initialized at 0
		}
		return word;
	}
}

export abstract class Registers {
	private static registers: Map<string, Register> = new Map<string, Register>();

	static {
		for (let i = 0; i < 32; i++) {
			let name = `i${i}`;
			const initialValue = 0x0;
			Registers.registers.set(name, new Register(name, initialValue));
		}
	}

	public static get(name: string): Register {
		let register = Registers.registers.get(name);

		if (!register) {
			throw new Error(`Register "${name}" not existent.`);
		}

		return register;
	}
}

export abstract class Instruction {
	abstract name: string;
	abstract opcode: number;
	abstract execute(): void;

	decode(number: number): Instruction {
		// TODO
		return this;
	}
}

// associative table for opcodes

export let Opcodes: Map<number, T extends Instruction>

abstract class BIRSTypeInstructions extends Instruction {
	f3: number = 0;
}

abstract class RTypeInstruction extends BIRSTypeInstructions {
	destination: Register;
	source1: Register;
	source2: Register;
	opcode = 0b0110011;
	f7: number = 0;

	constructor(destination: Register, source1: Register, source2: Register) {
		super();
		this.destination = destination;
		this.source1 = source1;
		this.source2 = source2;
	}

	execute(): void {
	}

	toString(): string {
		return `${this.name} ${this.destination.name}, ${this.source1.name}, ${this.source2.name}`
	}
}


export class AddInstruction extends RTypeInstruction {
	name = "add";
	f3 = 0b000;
	execute(): void {
		this.destination.value = this.source1.value + this.source2.value;
	}
}

export class SubInstruction extends RTypeInstruction {
	name = "sub";
	f3 = 0b000;
	f7 = 0b0100000;
	execute(): void {
		this.destination.value = this.source1.value - this.source2.value;
	}
}

export class XorInstruction extends RTypeInstruction {
	name = "xor";
	f3 = 0b100;
	execute(): void {
		this.destination.value = this.source1.value ^ this.source2.value;
	}
}

export class AndInstruction extends RTypeInstruction {
	name = "and";
	f3 = 0b111;
	execute(): void {
		this.destination.value = this.source1.value & this.source2.value;
	}
}

export class OrInstruction extends RTypeInstruction {
	name = "or";
	f3 = 0b110;
	execute(): void {
		this.destination.value = this.source1.value | this.source2.value;
	}
}

abstract class ITypeInstruction extends BIRSTypeInstructions {
	destination: Register;
	source: Register;
	immediate: number;
	opcode = 0b0000011;

	constructor(destination: Register, source: Register, immediate: number) {
		super();
		this.destination = destination;
		this.source = source;
		this.immediate = immediate;
	}

	toString(): string {
		return `${this.name} ${this.destination.name}, ${this.immediate}(${this.source.name})`
	}
}

export class LwInstruction extends ITypeInstruction {
	name = "lw";
	f3 = 0b010;

	execute(): void {
		this.destination.value = Memory.get(this.source.value + this.immediate);
	}
}

abstract class STypeInstruction extends BIRSTypeInstructions {
	source1: Register; // the value to store in memory
	source2: Register; // add to this the immediate, that's the address to store in memory
	immediate: number;
	opcode = 0b0100011;

	constructor(destination: Register, source: Register, immediate: number) {
		super();
		this.source1 = destination;
		this.source2 = source;
		this.immediate = immediate;
	}

	toString(): string {
		return `${this.name} ${this.source1.name}, ${this.immediate}(${this.source2.name})`
	}
}

export class SwInstruction extends STypeInstruction {
	name = "lw";
	f3 = 0b010;

	execute(): void {
		Memory.set(this.source2.value + this.immediate, this.source1.value);
	}
}



Registers.get("i1").value = 0b1111;
console.log(Registers.get("i1"));
let load = new LwInstruction(Registers.get("i1"), Registers.get("i2"), 0)
Memory.set(0x0000_0000, 0x0000_00ff);
console.log(load.toString());
console.log(load);
load.execute();
console.log(Registers.get("i1"));
