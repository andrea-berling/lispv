import { DEBUG, DEBUG_ASSEMBLER } from "./flags";
import { Instruction } from "./instruction";
import { Memory } from "./memory";
import { ProgramCounter } from "./program_counter";

const debug = DEBUG || DEBUG_ASSEMBLER;

export class Assembler {
	static comment: RegExp = new RegExp("#.*");

	/**
	 * @param lines An array of strings representing the instructions in asm.
	 */

	static parse(lines: string[]) {

		let i: Instruction;
		let encoded: number;

		for (let line of lines) {
			line = line.replace(Assembler.comment, "").trim();

			if (line == "")
				continue;

			try {
				i = Instruction.assemble(line);
				debug && console.log(i);
				encoded = i.encode();
				Memory.set(ProgramCounter.address, encoded);
				ProgramCounter.increase();
			}

			catch (e: any) {
				console.error(e);
			}
		}
	}

}