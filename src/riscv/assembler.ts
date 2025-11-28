import { DEBUG, DEBUG_ASSEMBLER } from "./flags";
import { Instruction } from "./instruction";
import { Labels } from "./label";
import { Memory } from "./memory";
import { ProgramCounter } from "./program_counter";
import { hex } from "./utils";

const debug = DEBUG || DEBUG_ASSEMBLER;

export class Assembler {
	static comment: RegExp = new RegExp("#.*");
	static label: RegExp = new RegExp("\S+:");
	static afterLabel: RegExp = new RegExp(":.*")

	/**
	 * @param lines An array of strings representing the instructions in asm.
	 */

	static parse(lines: string[]) {

		let addr = 0;
		let i: Instruction;
		let encoded: number;
		let label: string;
		let line: string;

		for (let lineNum = 0; lineNum < lines.length; lineNum++) {
			line = lines[lineNum];

			line = line.replace(Assembler.comment, "").trim();

			if (line == "")
				continue;

			try {
				if (line.includes(":")) {
					label = line.replace(this.afterLabel, "");
					Labels.set(label, addr)
					continue;
				}
				i = Instruction.assemble(line);
				i.address = addr;
				debug && console.log(i);
				encoded = i.encode();
				Memory.set(addr, encoded);
				addr += 4;
			}

			catch (e: any) {
				console.error(e);
			}
		}
	}

	static disassemble() {

		let instructions: Instruction[] = [];

		let addr = 0;
		let encoded: number;
		let i: Instruction;

		do {
			encoded = Memory.get(addr);
			i = Instruction.decode(encoded);
			i.address = addr;
			instructions.push(i);
			addr += 4;
		} while (i.tag != "halt");

		return instructions;
	}

}