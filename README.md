# Lispv - a didactic lisp-like language that compiles to rv32i assembly

This project is comprised of 4 main packages:

- `riscv`: an implementation of a simulator for a risc cpu.
- `parser`: a context-free-grammar parser combinator library.
- `lang`: a lisp programming language, comprehensive of an interpreter and a compiler.
- `frontend`: a vue application that let the user play with the language, and the simulator.

## Riscv simulator

Despite only implementing 37/40 instructions of the official specification[^riscv-specification], the code for this simulator was thought to be extensible.

```typescript

abstract class RTypeInstruction extends Instruction {/* ... */}

export class CustomInstruction extends RTypeInstruction {
	static tag = "cust";

	execute(): void {
		// what the instruction should do, given the Registers this.destination, this.source1, this.source2
	}

	static {
		InstructionRegistry.register(this);
	}
}
```

For every instruction defined of the ISA, there is a class that extends Instruction. The _mnemonic_ for the instruction is here called `tag` for better ease.
