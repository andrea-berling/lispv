import { hex } from "./utils";

/**
 * data memory and instruction memory are unified (Von Neumann architecture). the memory is addressed to the byte.
 */
export abstract class Memory {
	private static cells = new Map<number, number>();
	private static accesses = 0;

	static clean() {
		Memory.cells = new Map<number, number>();
		Memory.accesses = 0;
	}

	static set(address: number, word: number, bytes: number = 4): void {
		address = address | 0;
		word = word | 0;
		Memory.cells.set(address, word);
		Memory.accesses += 1;
	}

	static getAccesses() {
		return Memory.accesses;
	}

	/**
	 * @param address The memory address.
	 * @param bytes The number of bytes to get
	 * @returns The `bytes`-long string of bits, represented by a `number`
	 */
	static get(address: number, bytes: number = 4): number {
		address = address | 0;
		let alignment = address & 0b11;

		let words = [Memory.cells.get((address >> 2) << 2) || 0, Memory.cells.get(((address + 4) >> 2) << 2) || 0];

		// if (!word) {
		// 	return 0; // memory initialized at 0
		// }

		switch (alignment) {
			case 0b00: {
				switch (bytes) {
					case 4: {
						return words[0];
					}

					case 2: {
						return words[0] >>> 16;
					}

					case 1: {
						return words[0] >>> 24;
					}

					default:
						throw new Error(`cannot index memory by ${bytes} bytes`)
				}
			}

			case 0b01: {
				switch (bytes) {
					case 4: {
						return words[0] << 8 + (words[1] & 0xff) ;
					}

					case 2: {
						return words[0] >> 16;
					}

					case 1: {
						return words[0] >> 24;
					}

					default:
						throw new Error(`cannot index memory by ${bytes} bytes`)
				}
			}

			case 0b10: {
			}

			case 0b11: {
			}
		}

		return 0;
	}

	static reset() {
		Memory.cells = new Map<number, number>();
	}

	static show() {
		// show memory addresses sorted
		for (let cell of Array.from(Memory.cells.entries()).sort((a, b) => a[0] - b[0])) {
			let addr = cell[0];
			let value = cell[1];

			console.log(`${hex(addr)}: ${hex(value)} (${value})`);
		}
	}
}