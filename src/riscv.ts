class Register {
	name: string;
	value: number;
	constructor(name: string, value: number) {
		this.name = name;
		this.value = value;
	}
}

export abstract class Registers {
	private static registers: Map<string, Register> = new Map<string, Register>();

	static {
		for (let i = 0; i < 32; i++) {
			let name = `i${i}`; // Usiamo 'r' per coerenza, ma puoi usare 'i'
			const initialValue = 0x0; // Valore iniziale
			Registers.registers.set(name, new Register(name, initialValue));
		}
	}

	/**
	 * Restituisce un Register dato il suo nome.
	 * @param name - Il nome del registro (e.g., "r0").
	 * @returns L'oggetto Register.
	 * @throws Error se il registro non esiste.
	 */
	public static get(name: string): Register {
		let register = Registers.registers.get(name);

		if (!register) {
			throw new Error(`Register "${name}" not existent.`);
		}

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
		this.destination.value = this.source1.value + this.source2.value;
	}
}


let i1 = Registers.get("i1");
let i2 = Registers.get("i2");
i1.value = 10;
let i3 = Registers.get("i3");
i2.value = 10;

let add = new RTypeInstruction(i3, i1, i2);
add.execute();

console.log(i3.value);