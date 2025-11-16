import { Instruction } from "./instruction";

export class InstructionRegistry {
	private static instance: InstructionRegistry;
	private binaryRegistry = new Map<number, typeof Instruction>();
	private tagRegistry = new Map<string, typeof Instruction>();

	private constructor() { }

	static getInstance(): InstructionRegistry {
		if (!InstructionRegistry.instance) {
			InstructionRegistry.instance = new InstructionRegistry();
		}
		return InstructionRegistry.instance;
	}

	static key(opcode: number, f3: number | null, f7: number | null): number {
		const f3Val = f3 ?? 0;
		const f7Val = f7 ?? 0;
		return (f7Val << 10) | (f3Val << 7) | opcode;
	}

	static register(f: Function) {
		const i = f as typeof Instruction;
		const key = InstructionRegistry.key(i.opcode, i.f3, i.f7);
		InstructionRegistry.getInstance().binaryRegistry.set(key, i);
		InstructionRegistry.getInstance().tagRegistry.set(i.tag, i);
	}

	getBinaryRegistry(): Map<number, typeof Instruction> {
		return this.binaryRegistry;
	}

	getTagRegistry(): Map<string, typeof Instruction> {
		return this.tagRegistry;
	}
}