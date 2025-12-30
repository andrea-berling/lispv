import "../../../src/riscv/instructions/utype"
import "../../../src/riscv/instructions/jtype"
import "../../../src/riscv/instructions/btype"
import "../../../src/riscv/instructions/itype"
import "../../../src/riscv/instructions/stype"
import "../../../src/riscv/instructions/rtype"

import { Assembler } from "../../../src/riscv/assembler";
import { Registers } from "../../../src/riscv/register"
import { ProgramCounter } from "../../../src/riscv/programCounter"

export const useAssemblyStore = defineStore("assembly", {
	state: () => ({
		lines: [] as string[],
		version: 0,
	}),
	actions: {
		setAssembly(lines: string[]) {
			const as = new Assembler(lines);
			as.parse();
			this.lines = as.lines;
			this.version++;
		},
		clear() {
			this.lines = [];
			this.version++;
		},
	},
})

export const useSimulatorStore = defineStore("simulator", {
	state: () => ({
		registers: Array(32).fill(0) as number[],
		pc: 0,
	}),
	actions: {
		update() {
			for (let i = 0; i < 32; i++)
				this.registers[i] = Registers.get(i).value;
			this.pc = ProgramCounter.address;
		}
	},
})
