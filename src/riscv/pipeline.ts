import { Instruction } from "./instruction";
import { Memory } from "./memory";
import { ProgramCounter } from "./program_counter";
import { Registers, Register } from "./register";
import { DEBUG, DEBUG_SIMULATOR } from "./flags";
import { hex } from "./utils";

const debug = DEBUG || DEBUG_SIMULATOR;

export class Pipeline {

	/**
	 * Start fetching from `Memory` at `ProgramCounter.address`, decode instructions with `static Instruction.decode(number)`, execute them immediately with `Instruction.execute()`. stop when an `HaltInstruction` is found.
	 */

	static init() {
		Memory.clean()
		Registers.clean();
		ProgramCounter.reset();
	}

	static run(maxIterations?: number) {

		let iter: number = 0;
		let addr: number;
		let encoded: number;
		let i: Instruction;

		do {
			// fetch
			addr = ProgramCounter.address;
			encoded = Memory.get(addr);
			debug && console.log("fetched: ", hex(encoded), "at", hex(addr));

			// decode. if the decoding fails the simulator crashes.
			i = Instruction.decode(encoded);
			i.address = ProgramCounter.address
			debug && console.log("decoded", i);

			// execute, memory, writeback
			i.execute();
			ProgramCounter.increase()

			iter++;
		} while (i.tag != "halt" && (maxIterations ? iter < maxIterations : true));

		debug && console.log("run finished at", Date(), `with ${Memory.getAccesses()} accesses`);

	}
}