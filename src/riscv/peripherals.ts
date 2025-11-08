/**
 * data memory and instruction memory are unified (Von Neumann architecture). the memory is addressed to the byte.
 */
export abstract class Memory {
	private static cells = new Map<number, number>();

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

	public static reset() {
		Memory.cells = new Map<number, number>();
	}
}