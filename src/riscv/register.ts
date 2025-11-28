import { hex } from "./utils";

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
		else
			throw new Error("register i0 hardwired to 0x00000000")
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

	static clean() {
		for (let i = 0; i < 32; i++) {
			let r = Registers.registers.get(i);
			if (r && i != 0)
				r.value = 0;
		}
	}

	static get(index: number): Register {
		let register = Registers.registers.get(index);

		if (!register) {
			throw new Error(`Register "${index}" not existent.`);
		}

		return register;
	}

	static parse(name: string): Register {
		return Registers.get(Number.parseInt(name.replace("i", "").trim()));
	}

	static show() {
		// show memory addresses sorted
		for (let cell of Array.from(Registers.registers.entries()).sort((a, b) => a[0] - b[0])) {
			let num = cell[0];
			let value = cell[1].value;

			if (value != 0)
				console.log(`${num}: ${hex(value)} (${value})`);
		}
	}
}