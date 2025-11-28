export abstract class ProgramCounter {
	public static address: number = 0;

	static increase() {
		ProgramCounter.address += 0b100;
	}

	static reset() {
		ProgramCounter.address = 0;
	}
}