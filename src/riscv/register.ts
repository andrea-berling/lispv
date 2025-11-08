/**
 * registers are 32 bit sized.
 */
export class Register {
	index: number;
	private _value: number;

	constructor(index: number) {
		this.index = index;
		this._value = 0;
	}

	get value() {
		return this._value;
	}

	set value(value: number) {
		if (this.index != 0)
			this._value = value;
	}

	toString() {
		return "i" + this.index;
	}
}

/**
 * there are 32 cpu registers, indexed with `get(index: number)`, where 0<=`number`<32. 
 */
export abstract class Registers {
	private static registers = new Map<number, Register>();

	static {
		for (let i = 0; i < 32; i++) {
			let r = new Register(i);
			Registers.registers.set(r.index, r);
		}
	}

	public static get(index: number): Register {
		let register = Registers.registers.get(index);

		if (!register) {
			throw new Error(`Register "${index}" not existent.`);
		}

		return register;
	}
}