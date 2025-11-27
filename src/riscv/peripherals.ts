import { hex } from "./utils";

/**
 * data memory and instruction memory are unified (Von Neumann architecture). the memory is addressed to the byte.
 */
export abstract class Memory {
	private static cells = new Map<number, number>();

	static clean() {
		Memory.cells = new Map<number, number>();
	}

	static set(address: number, word: number): void {
		address = address | 0;
		word = word | 0;
		Memory.cells.set(address, word);
	}

	/**
	 * 
	 * @param address The memory address.
	 * @returns The content of the 4 adjacent memory cells, as a WORD, represented by a `number`
	 */
	static get(address: number): number {
		let word = Memory.cells.get(address);
		if (!word) {
			return 0; // memory initialized at 0
		}
		return word;
	}

	static reset() {
		Memory.cells = new Map<number, number>();
	}

	static show() {
		// show memory addresses sorted
		for (let cell of Array.from(Memory.cells.entries()).sort((a, b) => a[0] - b[0])) {
			let addr = cell[0];
			let value = cell[0] | 0;

			console.log(`0x${hex(addr)}: 0x${hex(value)} (${value})`);
		}
	}
}