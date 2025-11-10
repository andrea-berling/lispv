/**
 * instructions are 4 byte data structures, comprised of an `opcode` and optionally the `f3` and `f7` fields. these are used to differentiate instruction types. the `Instruction` class is extended by concrete classes, that define a `name` for a specific instruction and an `execute()` method that is run during the execution. instructions are fetched from memory as a `number` and decoded to the correct instruction type, that assigns the correct registry or immediate fields. subclasses of `Instruction` must define the `encode()` method that translates the `Instruction` object into the `number` that is stored in memory, and the `static factory(encoded: number)` method, that cares to decode only the registry and immediate fields and instantiate the specific `Instruction` class.
 */

export abstract class Instruction {
	abstract execute(): void;
	abstract encode(): number;
	abstract disassemble(): string;

	static tag: string = "";
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
	get tag(): string {
		return (this.constructor as typeof Instruction).tag;
	}

	/**
	 * we cannot use decorators, as static properties are initialized only after decorators are applied, so every concrete subclass of instruction must have a `static {this.signal()}` block.
	 */
	static signal(this: any) {
		const { opcode, f3, f7, tag } = this;
		const key = Instruction.registryKey(opcode, f3, f7);
		Instruction.binaryRegistry.set(key, this);
		Instruction.tagRegistry.set(tag, this);
	}

	static registryKey(opcode: number, f3: number, f7: number) {
		return opcode + f3 << 7 + f7 << (3 + 7);
	}

	static readonly binaryRegistry = new Map<number, new (...args: any[]) => Instruction>();

	static readonly tagRegistry = new Map<string, new (...args: any[]) => Instruction>();

	/**
	 *	static method to decode the binary representation of the instruction. 
	 */
	static decode(encoded: number): Instruction {
		let opcode = 0;
		let f3 = 0;
		let f7 = 0;

		let key: number;
		let instructionClass: (new (...args: any[]) => Instruction);

		let possibleInstructionClass: (new (...args: any[]) => Instruction) | undefined = undefined;

		let prepareDecoding = () => { return (instructionClass as any).factoryFromBinary(encoded) }

		opcode = encoded & 0b1111111;
		key = Instruction.registryKey(opcode, f3, f7);
		possibleInstructionClass = Instruction.binaryRegistry.get(key);
		if (!possibleInstructionClass)
			throw new Error("opcode not found");

		instructionClass = possibleInstructionClass;

		f3 = (encoded >> 12) & 0b111;
		key = Instruction.registryKey(opcode, f3, f7);
		possibleInstructionClass = Instruction.binaryRegistry.get(key);
		if (possibleInstructionClass)
			instructionClass = possibleInstructionClass;

		f7 = (encoded >> 25) & 0b1111111;
		key = Instruction.registryKey(opcode, f3, f7);
		possibleInstructionClass = Instruction.binaryRegistry.get(key);
		if (possibleInstructionClass)
			instructionClass = possibleInstructionClass;

		if (!instructionClass) {
			throw new Error(`Unknown instruction: opcode=${opcode}, f3=${f3}, f7=${f7}`);
		}

		return prepareDecoding();
	}

	static factoryFromBinary(encoded: number): Instruction {
		throw new Error("factory must be implemented by subclass");
	}

	/**
	 * a static method to parse the assembly line into an object representation.
	 */
	static assemble(line: string): Instruction {
		let tag = line.split(" ")[0];
		let parameters = line.substr(line.indexOf(" ") + 1);

		let instructionClass = Instruction.tagRegistry.get(tag);

		if (!instructionClass)
			throw new Error(`instruction ${tag} not implemented.`);

		return (instructionClass as any).factoryFromBinary(parameters);
	}

	static factoryFromTag(parameters: string): Instruction {
		throw new Error("factory must be implemented by subclass");
	}
}
