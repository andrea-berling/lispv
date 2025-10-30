class Register {
	name: string;
	value: number;
	constructor(name: string, value: number) {
		this.name = name;
		this.value = value;
	}
}

abstract class Registers {
	public static registers: Map<string, Register> = new Map<string, Register>();

	// constructor() {
	// 	Register.registers = new Map<string, Register>();

	// 	for (let i = 0; i < 32; i++) {
	// 		let name = "i" + i;
	// 		Register.registers.set(name, new Register(name, 0x0));
	// 	}
	// }

	public static get(name: string): Register {
		let register = Register.registers.get(name);
		if (!register)
			throw new Error("nonexistent register")
		return register;
	}
}

class Instruction {
	constructor() {

	}

	execute() { }
}

class RTypeInstruction extends Instruction {

	destination: Register;
	source1: Register;
	source2: Register;

	constructor(destination: Register, source1: Register, source2: Register) {
		super();
		this.destination = destination;
		this.source1 = source1;
		this.source2 = source2;
	}

	execute(): void {
	}
}

