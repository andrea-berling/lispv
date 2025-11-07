export function bin(num: number, bits?: number) {
	let s = (num >>> 0).toString(2);
	if (!bits)
		return s;
	return "0".repeat(bits - s.length) + (num >>> 0).toString(2);
}

/**
 * data memory and instruction memory are unified (Von Neumann architecture). the memory is addressed to the byte.
 */
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

export class Register {
	name: string;
	index: number;
	value: number;
	constructor(index: number, value: number) {
		this.index = index;
		this.name = "i" + this.index;
		this.value = value;
	}
}

/**
 * registers are 32 bit sized, i0..i32
 */

export abstract class Registers {
	private static registers = new Map<number, Register>();

	static {
		for (let i = 0; i < 32; i++) {
			let r = new Register(i, 0);
			Registers.registers.set(r.index, r);
		}
	}

	public static get(index: number): Register {
		let register = Registers.registers.get(index);

		if (!register) {
			throw new Error(`Register "${name}" not existent.`);
		}

		return register;
	}
}

export abstract class ProgramCounter {

}

export abstract class Instruction {
	abstract name: string;
	abstract execute(): void;

	static opcode: number = 0;
	static f3: number = 0;
	static f7: number = 0;

	// get fields for instances
	get opcode(): number {
		return (this.constructor as typeof Instruction).opcode;
	}

	get f3(): number {
		return (this.constructor as typeof Instruction).f3;
	}

	get f7(): number {
		return (this.constructor as typeof Instruction).f7;
	}

	static registry = new Map<number, typeof Instruction>();

	static decode(encoded: number): Instruction {
		// opcode and f3 have fixed positions
		const opcode = encoded & 0b1111111;
		const f3 = (encoded >> 12) & 0b111;

		switch (opcode) {
			case RTypeInstruction.opcode:
				{
					// r type instructions also have field f7
					const f7 = (encoded >> 25) & 0b1111111;

					const rd = (encoded >> 7) & 0b11111;
					const rs1 = (encoded >> 15) & 0b11111;
					const rs2 = (encoded >> 20) & 0b11111;

					switch (f3) {

						case AddInstruction.f3:
							switch (f7) {
								case AddInstruction.f7:
									return new AddInstruction(rd, rs1, rs2);
								case SubInstruction.f7:
									return new SubInstruction(rd, rs1, rs2);
							}
						case OrInstruction.f3:
							return new OrInstruction(rd, rs1, rs2);

					}
				}

			case ITypeInstruction.opcode:
				{

					const rd = (encoded >> 7) & 0b11111;

					break;

				}
			
			case JalrInstruction

		}

		throw new Error("not implemented!");
	}
}

abstract class RTypeInstruction extends Instruction {
	destination: Register;
	source1: Register;
	source2: Register;

	static opcode = 0b0110011;
	static f7 = 0b0000000;

	constructor(destination: number, source1: number, source2: number) {
		super();
		this.destination = Registers.get(destination);
		this.source1 = Registers.get(source1);
		this.source2 = Registers.get(source2);
	}

	toString(): string {
		return `${this.name} ${this.destination.name}, ${this.source1.name}, ${this.source2.name}`
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
}

export class AddInstruction extends RTypeInstruction {
	name = "add";
	static f3 = 0b000;
	execute(): void {
		this.destination.value = this.source1.value + this.source2.value;
	}
}

export class SubInstruction extends RTypeInstruction {
	name = "sub";
	static f3 = 0b000;
	static f7 = 0b0100000;
	execute(): void {
		this.destination.value = this.source1.value - this.source2.value;
	}
}

export class XorInstruction extends RTypeInstruction {
	name = "xor";
	static f3 = 0b100;
	execute(): void {
		this.destination.value = this.source1.value ^ this.source2.value;
	}
}

export class AndInstruction extends RTypeInstruction {
	name = "and";
	static f3 = 0b111;
	execute(): void {
		this.destination.value = this.source1.value & this.source2.value;
	}
}

export class OrInstruction extends RTypeInstruction {
	name = "or";
	static f3 = 0b110;
	execute(): void {
		this.destination.value = this.source1.value | this.source2.value;
	}
}

abstract class ITypeInstruction extends Instruction {
	destination: Register;
	source: Register;
	immediate: number;

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

export class JalrInstruction extends ITypeInstruction {
	name = "jalr";
	static f3 = 0b000;

	execute(): void {
		// TODO
	}
}

abstract class MemoryLoadInstruction extends ITypeInstruction {
	static opcode = 0b0000011;
}

export class LwInstruction extends MemoryLoadInstruction {
	name = "lw";
	static f3 = 0b010;

	execute(): void {
		this.destination.value = Memory.get(this.source.value + this.immediate);
	}
}

abstract class IntegerRegisterImmediateInstruction extends ITypeInstruction {
	static opcode = 0b0010011;
}

export class AddiInstruction extends IntegerRegisterImmediateInstruction {
	name = "addi";
	static f3 = 0b000;

	execute(): void {
		// TODO
	}
}


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
		return `${this.name} ${this.source1.name}, ${this.immediate}(${this.source2.name})`
	}
}

export class SwInstruction extends STypeInstruction {
	name = "lw";
	static f3 = 0b010;

	execute(): void {
		Memory.set(this.source2.value + this.immediate, this.source1.value);
	}
}

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
		return `${this.name} ${this.source1.name}, ${this.source2.name}, ${this.immediate}`
	}
}


Registers.get(1).value = 0b1111;
console.log(Registers.get(1));

let load = new LwInstruction(Registers.get(1), Registers.get(2), 0)

Memory.set(0x0000_0000, 0x0000_00ff);

console.log(load.toString());
console.log(load);

load.execute();

console.log(Registers.get(1));


console.log(AddInstruction.opcode);
let sub = new AddInstruction(Registers.get(1), Registers.get(1), Registers.get(1));
console.log(sub.opcode);

console.log(bin(sub.encode(), 32));

let i = Instruction.decode(sub.encode());

console.log(i);