export abstract class Immediate {
	abstract bits: any;
	value: number = 0;

	static parse(s: string): Immediate {
		throw new Error("must do static parsing from concrete Immediate subclass")
	}

	overflow() {
		let max = (1 << (this.bits - 1)) - 1;
		let min = - (1 << (this.bits - 1));

		return (this.value < min || this.value > max);
	}

	extendTo(c: typeof Immediate) {

	}
}

export abstract class UnsignedImmediate extends Immediate {
	overflow() {
		let max = (1 << (this.bits)) - 1;
		let min = 0;

		return (this.value < min || this.value > max);
	}
}

/**
 * signed 12 bit immediate.
 */
export class Immediate12 extends Immediate {
	readonly bits: 12 = 12;
	constructor(value: number) {
		super();
		this.value = value;

		if (this.overflow())
			throw new Error(value + " overflows " + this);

		// sign extension
		this.value = (value & 0x800) ? (value | 0xFFFFF000) : value;
	}

	//TODO remove eval
	static parse(s: string) {
		return new Immediate12(Number.parseInt(eval(s.trim())));
	}
}

/**
 * unsigned 12 bit immediate.
 */
export class UnsignedImmediate12 extends UnsignedImmediate {
	readonly bits: 12 = 12;
	constructor(value: number) {
		super();
		this.value = value;

		if (this.overflow())
			throw new Error(value + " overflows " + this);
	}

	//TODO remove eval
	static parse(s: string) {
		return new UnsignedImmediate12(Number.parseInt(eval(s.trim())));
	}
}

/**
 * signed 20 bit immediate.
 */
export class Immediate20 extends Immediate {
	readonly bits: 20 = 20;
	constructor(value: number) {
		super();
		this.value = value;

		if (this.overflow())
			throw new Error(value + " overflows " + this);

		// sign extension
		this.value = (value & 0x80000) ? (value | 0xFFF00000) : value;
	}

	static parse(s: string) {
		return new Immediate20(Number.parseInt(s.trim()));
	}
}